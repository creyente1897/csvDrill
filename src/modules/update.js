const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');
const csv = require('csvtojson');

module.exports = async function(query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    path = newPath + '/' + query[1].trim().toLowerCase();
    if(fs.existsSync(path) && query[1].trim().toLowerCase().match('.csv') && query[1].trim().toLowerCase().length > 0){
        cli.action.start('loading file ...');
        let jsonArray = await csv().fromFile(path);
        cli.action.stop();
        if(query[2] == 'SET'){
            let data = query[3].toLowerCase().split('&');
            let setData = [];
            for(let i in data){
                setData.push(data[i].split('='));
            }
            if(query[4] == 'WHERE'){
                let find = query[5].toLowerCase().split('&');
                let findValue = [];
                for(let i in find){
                    findValue.push(find[i].split('='));
                }
                let dataFlag = 0;
                let valueFlag = 0;
                let keys = Object.keys(jsonArray[0]);
                for(let i in keys){
                    for(let j in setData){
                        if(keys[i].toLowerCase() == setData[j][0]){
                            dataFlag++;
                        }
                    }
                }
                for(let i in keys){
                    for(let j in findValue){
                        if(keys[i].toLowerCase() == findValue[j][0]){
                            valueFlag++;
                        }
                    }
                }
                let conditionFlag = 0;
                if(dataFlag > 0 && valueFlag > 0){
                    for(let i in jsonArray){
                        for(let j in findValue){    
                            if(jsonArray[i][findValue[j][0]] ==  findValue[j][1]){
                                for(let k in findValue){
                                    if(jsonArray[i][findValue[k][0]] == findValue[k][1]){
                                        conditionFlag++
                                    }
                                }
                                if(conditionFlag > 0 && conditionFlag == findValue.length){
                                    for(let k in setData){
                                        jsonArray[i][setData[k][0]] = setData[k][1];
                                    }   
                                }
                                conditionFlag = 0;
                            }
                        }
                    }
                    let newJsonArray = [];
                    for(let i in jsonArray){
                        let tempArray = [];
                        for(let j in keys){
                            tempArray.push(jsonArray[i][keys[j]]);
                        }
                        newJsonArray.push(tempArray);
                    }
                    if(conditionFlag > 0){
                        console.log(chalk.red('Something went wrong!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                    else{
                        const createCsvWriters = require('csv-writer').createArrayCsvWriter;
                        const csvWriter = createCsvWriters({
                            header: keys,
                            path: path
                        });
                        
                        const records = newJsonArray;
                        
                        csvWriter.writeRecords(records)
                            .then(() => {
                                console.log(chalk.green('Updated Successfully!'));
                                console.log(chalk.magenta('Press enter to continue'));
                            })
                            .catch((err) => {
                                console.log(chalk.red(err));
                                console.log(chalk.magenta('Press enter to continue'));
                            })
                    }
                }
                else{
                    console.log(chalk.red('Column not found'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Command not valid!'));
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