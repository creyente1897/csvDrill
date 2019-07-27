const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');
const csv = require('csvtojson');

module.exports = async function(query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    path = newPath + '/' + query[2].trim().toLowerCase();
    if(fs.existsSync(path) && query[2].trim().toLowerCase().match('.csv') && query[2].trim().toLowerCase().length > 0){
        cli.action.start('loading file ...');
        let jsonArray = await csv().fromFile(path);
        cli.action.stop();
        let find = query[4].trim().toLowerCase().split('&');
        let findData = [];
        for(let i in find){
            findData.push(find[i].split('='));
        }
        let flag = 0;
        let keys = Object.keys(jsonArray[0]);
        for(let i in keys){
            for(let j in findData){
                if(keys[i] == findData[j][0]){
                    flag++;
                }
            }
        }
        if(flag <= keys.length){
            let tempArray = [];
            for(let i in jsonArray){
                let findFlag = 0;
                for(let j in findData){
                    if(jsonArray[i][findData[j][0]] == findData[j][1]){
                        findFlag++;
                    }
                }
                if(findFlag == findData.length){
                    tempArray.push(parseInt(i, 10));
                }
            }
            if(tempArray.length > 0){
                for(let i in tempArray){
                    tempArray[i] = tempArray[i] - i;
                }
                for(let i in tempArray){
                   jsonArray.splice(tempArray[i],1);
                }
                let newJsonArray = [];
                for(let i in jsonArray){
                    let tempArray = [];
                    for(let j in keys){
                        tempArray.push(jsonArray[i][keys[j]]);
                    }
                    newJsonArray.push(tempArray);
                }
                const createCsvWriters = require('csv-writer').createArrayCsvWriter;
                const csvWriter = createCsvWriters({
                    header: keys,
                    path: path
                });
                const records = newJsonArray;        
                csvWriter.writeRecords(records)
                    .then(() => {
                        console.log(chalk.green('Deleted Successfully!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    })
                    .catch((err) => {
                        console.log(chalk.red(err));
                        console.log(chalk.magenta('Press enter to continue'));
                    })
                    
            }
            else{
                console.log(chalk.red('Specified Row(s) not found!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('Column(s) not found!'));
            console.log(chalk.magenta('Press enter to continue'));
        }

    }
    else{
        console.log(chalk.red('File does not exists'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}