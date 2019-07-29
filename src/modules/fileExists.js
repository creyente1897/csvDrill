// Installed Dependencies
const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');

// Required Module Exports
const command = require('./input');

// Function for checking whether the given path or file to that path exist or not
// @returns = Next line to execute the SQL statements
module.exports = function (path){
    // Check whether the path exists or not
    if(fs.existsSync(path)){
      fs.lstat(path, async (err, result) => {
        // Check whether the path is a directory
        if(result.isDirectory()){
            let file = await cli.prompt(chalk.bgCyan('Please enter a filename in lower case only(if not available it will be created)'));
            file = file.toLowerCase();
            if(file.trim() == 'exit'){
                console.log(chalk.magenta('BYE!'));
            }
            else{
                // Check whether a file is a csv file or not
                if(file.trim().match('.csv')){
                    if(file.trim().length > 4){
                        const filePath = path + '/' +file.trim();
                        fs.appendFile(filePath, '', async (err) => {
                            if (err) throw chalk.red(err);
                            else{
                                let input = await cli.prompt(chalk.cyan('> '));
                                while(input != 'exit'){
                                    while(input.trim().substring(input.trim().length - 1) != ';'){
                                        let newinput = await cli.prompt(chalk.cyan('> ~ '));
                                        input = input + ' ' + newinput;
                                    }
                                    command(input.trim(), filePath);
                                    input = await cli.prompt(chalk.cyan('> '));
                                }
                                console.log(chalk.magenta('BYE!'));
                            }
                        });
                    }
                    else{
                        console.log(chalk.red('Please enter file name'));    
                    }
                }
                else{
                    console.log(chalk.red('Please enter a csv file or add .csv extension!'));
                }
            }
          }
          // Check whether the path is a file
          if(result.isFile()){
            let fileindex = path.lastIndexOf('/');
            let newPath = path.substring(0, fileindex).trim();
            let file = path.substring(fileindex+1).trim().toLowerCase();
            path = newPath + '/' + file;
            if(file.match('.csv')){
                if(file.length > 4){
                    fs.appendFile(path, '', async (err) => {
                        if (err) throw chalk.red(err);
                        else{
                            let input = await cli.prompt(chalk.cyan('> '));
                            while(input != 'exit'){
                                while(input.trim().substring(input.trim().length - 1) != ';'){
                                    let newinput = await cli.prompt(chalk.cyan('> ~ '));
                                    input = input + ' ' + newinput
                                }
                                command(input.trim(), path)
                                input = await cli.prompt(chalk.cyan('> '));
                            }
                            console.log(chalk.magenta('BYE!'));
                        }
                    });  
                }
                else{
                    console.log(chalk.red('Please enter file name'));    
                }
            }
          }
      });
    }
    else{
      console.log(chalk.red('The directory or file does not exists! Filename should be all lower case or else another file with the same name but lower case will be created!'));
    }
}