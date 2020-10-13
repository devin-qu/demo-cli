
const path = require('path');
const fs = require('fs');
// 将nodejs方法的标准写法method(xxx, (error) => {}),转换成promise写法。
const { promisify } = require('util');
let downloadGitRepo = require('download-git-repo');
const Metalsmith = require('metalsmith');
const Handlebars = require("handlebars");
const rm = require('rimraf').sync;
const ora = require('ora');
const question = require('./questions');
const axios = require('axios');

function download(repo, dest) {
    return promisify(downloadGitRepo)(repo, dest);
}

function isExistFolder(file) {
    return fs.existsSync(file);
}

function generator(source, dest, metadata = {}) {
    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .source(source)
            .destination(dest)
            .clean(true)
            .use((files, metalsmith, callback) => {
                const data = metalsmith.metadata();
                Object.keys(files).forEach(file => {
                    // files[file].contents 是个文件流 Buffer类型
                    const context = files[file].contents.toString();
                    const str = Handlebars.compile(context)(data);
                    files[file].contents = Buffer.from(str);
                });
                callback();
            })
            .build((err) => {
                rm(source);
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });
    });
}

function loading(fn, message) {
    return async (...args) => {
        const spinner = ora(message);
        spinner.start();
        const data = await fn(...args);
        spinner.succeed();
        return data;
    }
}

async function create(args) {
    const folderName = args[0];
    const folderPath = path.resolve(process.cwd(), folderName);
    const TEMPDIR = path.resolve(process.cwd(), '.TEMPLATE');
    const state = isExistFolder(folderPath);
    if (!state) {
        await loading(download, '模板下载中...')('devin-qu/xdqu-cli-template', TEMPDIR);
        const answers = await question();
        await loading(generator, '项目生成中...')(TEMPDIR, folderName, answers);
    } else {
        console.error('当前目录下已存在', folderName);
    }
}

module.exports = { create };

