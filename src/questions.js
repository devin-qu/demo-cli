const inquirer = require('inquirer');
const name = process.argv.slice(3)[0];

const questions = [
    {
        name: 'projectName',
        message: '项目名称:',
        default: name,
    },
    {
        name: 'version',
        message: '项目版本',
        default: '1.0.0'
    },
    {
        name: 'description',
        message: '项目描述',
        default: 'description'
    }
];

module.exports = function() {
    return inquirer.prompt(questions);
}