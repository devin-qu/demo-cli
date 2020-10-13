const path = require('path');
const program = require('commander');
const { create } = require('./create');
const { name, version } = require('../package.json');

program.name(name).version(version);
program
    .command('create')
    .description('create an application.')
    .action(() => {
        const rest = process.argv.slice(3);
        if (rest) {
            create(rest);
        }
    });
program.on('command:*', (operands) => {
    console.error(`error: unknown command '${operands[0]}'`);
});
// process 是node的全局对象，不需要require引入
program.parse(process.argv); // 放在末尾


