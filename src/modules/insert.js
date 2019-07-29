// Installed Dependencies
const fs = require('fs');
const chalk = require('chalk');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

// Function to perform Insert Operations on the given file
// @returns the file with the appended values
module.exports = async function(query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    path = newPath + '/' + query[2].trim().toLowerCase();  
    if(fs.existsSync(path) && query[2].trim().toLowerCase().match('.csv') && query[2].trim().toLowerCase().length > 0){
        let data = query[3].toLowerCase().trim().split(',');
        if(query[4] == 'VALUES' && query[5].length > 0){
            let recordString = query[5].toLowerCase().trim().split('&');
            let record = [];
            for(let i in recordString){
                let dataValues = recordString[i].split(',');
                record.push(dataValues);
            }
            // Check whether the no. of values and the no. of input columns are same or not
            let invalidValues = false;
            for(let i in record){
                if(data.length != record[i].length){
                    invalidValues = true;
                    break;
                }
            }
            // Inser the values in the csv file
            if(invalidValues == false){
                const csvWriter = createCsvWriter({
                    path: path,
                    header: data,
                    append: true
                });
                csvWriter.writeRecords(record)
                .then(() => {
                    console.log(chalk.green('Inserted Successfully!'));
                    console.log(chalk.magenta('Press enter to continue'));
                })
                .catch((err) => {
                    console.log(chalk.red(err));
                    console.log(chalk.magenta('Press enter to continue'));
                });                  
                record = [];
            }
            else{
                console.log(chalk.red('Values not valid!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('Command not valid!'));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    else{
        console.log(chalk.red('File does not exists'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}