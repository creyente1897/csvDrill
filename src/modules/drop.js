const fs = require('fs');
const chalk = require('chalk');

module.exports = async function(query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    path = newPath + '/' + query[2].trim().toLowerCase();
    if(query[2] != undefined && query[2].length > 4 && query[2].trim().toLowerCase().match('.csv') && query.length == 3){
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
        console.log(chalk.red('ommand not valid!'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}