// Installed Dependencies
const fs = require('fs');
const chalk = require('chalk');

// Function to delete the csv file
// @returns Table DROP message when the file is Deleted
module.exports = async function(query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    path = newPath + '/' + query[2].trim().toLowerCase();
    if(query[2] != undefined && query[2].length > 4 && query[2].trim().toLowerCase().match('.csv') && query.length == 3){
        // Check if the file exists and then delete it
        if(fs.existsSync(path)){
            fs.unlink(path, (err) => {
                if (err) throw chalk.red(err);
                console.log(chalk.green('Table Dropped Successfully!'));
                console.log(chalk.magenta('Press enter to continue'));
            });
        }    
        else{
            console.log(chalk.red('File does not exists!'));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    else{
        console.log(chalk.red('Command not valid!'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}