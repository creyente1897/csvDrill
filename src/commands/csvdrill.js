const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux');
const chalk = require('chalk');

const fileExists = require('./../modules/fileExists');

class CsvdrillCommand extends Command {
  async run() {
    const {flags} = this.parse(CsvdrillCommand)
    fileExists(flags.dbpath);
  }
}

CsvdrillCommand.description = `Describe the command here
...
Extra documentation goes here
`
CsvdrillCommand.flags = {
  dbpath: flags.string({char: 'd', description: 'Path a directory where the files will be stored'})
}

module.exports = CsvdrillCommand
