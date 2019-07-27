const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');
const cTable = require('console.table');

module.exports = async function (query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    if(query[2] != undefined && query[2].length > 4 && query[2].trim().toLowerCase().match('.csv')){
        path = newPath + '/' + query[2].trim().toLowerCase();
        if(fs.existsSync(path)){
            console.log(chalk.red('File already exists!'));
            console.log(chalk.magenta('Press enter to continue'));
        }
        else{
            if(query[3] != undefined && query.length == 4){
                path = newPath + '/' + query[2].trim().toLowerCase();
                let data = query[3].toLowerCase().split(',');
                if(data != undefined && data.length > 0){
                    cli.action.start('Processing');
                    fs.appendFile(path, data, async (err) => {
                        if(err) throw chalk.red(err);
                        else{
                            cli.action.stop();
                            console.log(chalk.green('Table created successfully!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    });
                }
                else{
                    console.log(chalk.red('Please put comma (,) symbol between each value without space!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Please enter a valid query (See docs to learn more)!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
    }
    else{
        console.log(chalk.red('Enter a valid csv file!'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}