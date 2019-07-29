const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux');
const chalk = require('chalk');

const fileExists = require('./../modules/fileExists');

/* The command takes in a path argument and then continues to execute
and return a command line CSV SQL Executor*/
class CsvdrillCommand extends Command {
  async run() {
    const {flags} = this.parse(CsvdrillCommand)
    fileExists(flags.dbpath);
  }
}

CsvdrillCommand.description = `CSV Drill is a CLI Tool for Performing SQL Query Execution on CSV Files
...
The command takes in a dbpath argument that helps specify the path where the files should be saved.
After the path has been verified, you can visit the following link to know more about the commands that can be used:

NOTE: All commands and files should be lowercase and all the commands will be performed in lowercase

https://github.com/creyente1897/csvDrill/blob/master/README.md

`
CsvdrillCommand.flags = {
  dbpath: flags.string({char: 'd', description: 'Path a directory where the files will be stored'})
}

module.exports = CsvdrillCommand
