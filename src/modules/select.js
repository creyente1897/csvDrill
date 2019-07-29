// Installed Dependencies
const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');
const csv = require('csvtojson');
const arraySort = require('array-sort');
const cTable = require('console.table');

// Function to perform the select statement
// @returns the a table with the selected values
module.exports = async function (query, path){
    let fileindex = path.lastIndexOf('/');
    let newPath = path.substring(0, fileindex).trim();
    // Select everything from a file
    if(query[1] != undefined && query[1] == '*' && query.length == 4){
        if(query[2] != undefined && query[2] == 'FROM'){
            if(query[3] != undefined && query[3].length > 0 && query.length == 4){
                path = newPath + '/' + query[3].trim().toLowerCase();
                try{
                    cli.action.start('loading file ...');
                    let jsonArray = await csv().fromFile(path);
                    cli.action.stop();
                    console.log();
                    console.table(jsonArray);
                    console.log(chalk.magenta('Press enter to continue'));
                }
                catch(err){
                    console.log(chalk.red(err));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red(`Cannot find file ${query[3]}`));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('Invalid Command!'));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    // Select particular columns from a file
    else if(query[1] != undefined && query[1].length > 0 && query.length == 4){
        if(query[2] != undefined && query[2] == 'FROM'){
            if(query[3] != undefined && query[3].trim().toLowerCase().match('.csv') && query[3].length > 4){
                path = newPath + '/' + query[3].trim().toLowerCase();
                if(fs.existsSync(path)){
                    let data = query[1].toLowerCase().split(',');
                    try{
                        cli.action.start('loading file ...');
                        let jsonArray = await csv().fromFile(path);
                        let printable = [];
                        for(let i in jsonArray){
                            let tempArray = [];
                            for(let j in data){
                                if(jsonArray[i][data[j]] != undefined){
                                    tempArray.push(jsonArray[i][data[j]]);
                                }
                            }
                            printable.push(tempArray);
                            tempArray = [];
                        }
                        let isEmpty = a => Array.isArray(a) && a.every(isEmpty);
                        cli.action.stop();
                        if(!isEmpty(printable)){
                            console.log();
                            console.table(data, printable);
                            printable = [];
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        else{
                            console.log(chalk.red('No data found'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    catch(err){
                        console.log(chalk.red(err));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('File does not exist'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Enter a valid csv file'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red(`Missing FROM keyword!`));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    // Select all or particular columns from a file with a where attribute
    else if(query[1] != undefined && query[1].length > 0 && query[4] == 'WHERE' && query.length == 8){
        if(query[1] == '*' && query[2] == 'FROM'){
            if(query[3] != undefined && query[3].trim().toLowerCase().match('.csv') && query[3].length > 4){
                path = newPath + '/' + query[3].trim().toLowerCase();
                if(fs.existsSync(path)){
                    if(query[4] == 'WHERE' && query[5].length > 0 && query[5] != '=' && query[6] == '=' && query[7].length > 0){
                        try{
                            cli.action.start('loading file ...');
                            let jsonArray = await csv().fromFile(path);
                            cli.action.stop();
                            let find = query[5].toLowerCase();
                            let printable = [];
                            if(jsonArray[0][find] != undefined){
                                for(let i in jsonArray){
                                    if(jsonArray[i][find] == query[7].toLowerCase()){
                                        printable.push(jsonArray[i]);
                                    }
                                }
                                console.table(printable);
                                printable = [];
                                console.log(chalk.magenta('Press enter to continue'));
                            }
                            else{
                                console.log(chalk.red('Cannot find values to search!'));
                                console.log(chalk.magenta('Press enter to continue'));
                            }
                            
                        }
                        catch(err){
                            console.log(chalk.red(err));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    else{
                        console.log(chalk.red('Command not valid!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('File does not exists!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Enter a valid csv file!'));
                console.log(chalk.magenta('Press enter to continue'));
            }                   
        }
        else if(query[2] == 'FROM'){
            if(query[3] != undefined && query[3].trim().toLowerCase().match('.csv') && query[3].length > 4){
                path = newPath + '/' + query[3].trim().toLowerCase();
                if(fs.existsSync(path)){
                    if(query[4] == 'WHERE' && query[5].length > 0 && query[5] != '=' && query[6] == '=' && query[7].length > 0){
                        try{
                            cli.action.start('loading file ...');
                            let jsonArray = await csv().fromFile(path);
                            cli.action.stop();
                            let find = query[5].toLowerCase();
                            let printable = [];
                            let data = query[1].trim().toLowerCase().split(',');
                            if(jsonArray[0][find] != undefined){
                                for(let i in jsonArray){
                                    if(jsonArray[i][find] == query[7].toLowerCase()){
                                        console.log(jsonArray[0][data[0]]);
                                        if(jsonArray[0][data[0]] != undefined){
                                            let tempArray = [];
                                            for(let j in data){
                                                tempArray.push(jsonArray[i][data[j]]);
                                            }
                                            printable.push(tempArray);
                                            tempArray = [];
                                        }
                                        else{
                                            console.log(chalk.red('Cannot find values to search!'));
                                            console.log(chalk.magenta('Press enter to continue'));
                                            break;
                                        }
                                    }
                                }
                                console.table(data, printable);
                                printable = [];
                            }
                            else{
                                console.log(chalk.red('Cannot find values to search!'));
                                console.log(chalk.magenta('Press enter to continue'));
                            }
                            
                        }
                        catch(err){
                            console.log(chalk.red(err));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    else{
                        console.log(chalk.red('Command not valid!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('File does not exists!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Enter a valid csv file!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('Command not valid!'));
            console.log(chalk.magenta('Press enter to continue'));
        }     
    }
    // Select all columns from a file with a limit attribute
    else if(query[1] != undefined && query[1] == '*' && (query.length == 5 || query.length == 6)){
        path = newPath + '/' + query[3].trim().toLowerCase();
        if(fs.existsSync(path) && query[3].trim().toLowerCase().match('.csv') && query[3].trim().toLowerCase().length > 4){
            cli.action.start('loading file ...');
            let jsonArray = await csv().fromFile(path);
            cli.action.stop();
            if(query.length == 5){
                let limit = query[4].split('=');
                if(limit.length == 2 && limit[0] == 'LIMIT'){
                    let limitValue = parseInt(limit[1], 10);
                    if(typeof limitValue == 'number' && limitValue <= jsonArray.length){
                        let result = [];
                        for(let i = 0; i < limitValue; i++){
                            result.push(jsonArray[i]);
                        }
                        console.table(result);
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                    else{
                        console.log(chalk.red('No. of rows not found!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('Command not found!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else if(query.length == 6){
                let limit = query[4].split('=');
                if(limit.length == 2 && limit[0] == 'LIMIT'){
                    let limitValue = parseInt(limit[1], 10);
                    if(typeof limitValue == 'number' && limitValue <= jsonArray.length){
                        let offset = query[5].split('=');
                        if(offset.length == 2 && offset[0] == 'OFFSET'){
                            let offsetValue = parseInt(offset[1], 10);
                            if(typeof offsetValue == 'number' && offsetValue <= jsonArray.length){
                                let result = [];
                                for(let i = offsetValue; i < limitValue+offsetValue; i++){
                                    result.push(jsonArray[i]);
                                }
                                console.table(result);
                                console.log(chalk.magenta('Press enter to continue'));
                            }
                            else{
                                console.log(chalk.red('Offset Value Invalid!'));
                                console.log(chalk.magenta('Press enter to continue'));
                            }
                        }
                        else{
                            console.log(chalk.red('Command not found!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    else{
                        console.log(chalk.red('No. of rows not found!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('Command not found!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Command not Valid!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('File does not exists'));
            console.log(chalk.magenta('Press enter to continue'));
        }
    
    }
    // Select particular columns from a file with a limit attribute
    else if(query[1] != undefined && query[1].length > 0 && (query.length == 5 || query.length == 6)){
        path = newPath + '/' + query[3].trim().toLowerCase();
        if(fs.existsSync(path) && query[3].trim().toLowerCase().match('.csv') && query[3].trim().toLowerCase().length > 4){
            cli.action.start('loading file ...');
            let jsonArray = await csv().fromFile(path);
            cli.action.stop();
            if(query.length == 5){
                let limit = query[4].split('=');
                if(limit.length == 2 && limit[0] == 'LIMIT'){
                    let limitValue = parseInt(limit[1], 10);
                    if(typeof limitValue == 'number' && limitValue <= jsonArray.length){
                        let find = query[1].trim().toLowerCase().split(',');
                        let keys = Object.keys(jsonArray[0]);
                        let flag = 0;
                        for(let i in keys){
                            for(let j in find){
                                if(keys[i] == find[j]){
                                    flag++;
                                }
                            }
                        }
                        if(flag <= keys.length){
                            let result = [];
                            for(let i = 0; i < limitValue; i++){
                                let tempObj = {};
                                for(let j in find){
                                    tempObj[find[j]] = jsonArray[i][find[j]];
                                }
                                result.push(tempObj);
                            }
                            console.table(result);
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        else{
                            console.log(chalk.red('Column not found!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    else{
                        console.log(chalk.red('No. of rows not found!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('Command not found!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else if(query.length == 6){
                let limit = query[4].split('=');
                if(limit.length == 2 && limit[0] == 'LIMIT'){
                    let limitValue = parseInt(limit[1], 10);
                    if(typeof limitValue == 'number' && limitValue <= jsonArray.length){
                        let offset = query[5].split('=');
                        if(offset.length == 2 && offset[0] == 'OFFSET'){
                            let offsetValue = parseInt(offset[1], 10);
                            if(typeof offsetValue == 'number' && offsetValue <= jsonArray.length){
                                let find = query[1].trim().toLowerCase().split(',');
                                let keys = Object.keys(jsonArray[0]);
                                let flag = 0;
                                for(let i in keys){
                                    for(let j in find){
                                        if(keys[i] == find[j]){
                                            flag++;
                                        }
                                    }
                                }
            ;
                                if(flag <= keys.length){
                                    let result = [];
                                    for(let i = offsetValue; i < limitValue+offsetValue; i++){
                                        let tempObj = {};
                                        for(let j in find){
                                            tempObj[find[j]] = jsonArray[i][find[j]];
                                        }
                                        result.push(tempObj);
                                    }
                                    console.table(result);
                                    console.log(chalk.magenta('Press enter to continue'));
                                }
                                else{
                                    console.log(chalk.red('Column not found!'));
                                    console.log(chalk.magenta('Press enter to continue'));
                                }
                            }
                            else{
                                console.log(chalk.red('Offset Value Invalid!'));
                                console.log(chalk.magenta('Press enter to continue'));
                            }
                        }
                        else{
                            console.log(chalk.red('Command not found!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    else{
                        console.log(chalk.red('No. of rows not found!'));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                else{
                    console.log(chalk.red('Command not found!'));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Command not Valid!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('File does not exists'));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    // Select all columns from a file with an order by attribute
    else if(query[1] != undefined && query[1] == '*' && query[4] == 'ORDER' && query[5] == 'BY' && (query.length == 7 || query.length == 8)){
        path = newPath + '/' + query[3].trim().toLowerCase();
        if(fs.existsSync(path) && query[3].trim().toLowerCase().match('.csv') && query[3].trim().toLowerCase().length > 4){
            if(query[2] == 'FROM' && query.length == 7){
                try{
                    cli.action.start('loading file ...');
                    let jsonArray = await csv().fromFile(path);
                    cli.action.stop();
                    try{
                        let result = arraySort(jsonArray, query[6].toLowerCase());
                        console.table(result);
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                    catch(err){
                        console.log(chalk.red(err));
                        console.log(chalk.red(`Column ${query[6].toLowerCase()} not found!`));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                catch(err){
                    console.log(chalk.red(err));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else if(query[2] == 'FROM' && query.length == 8 && query[7] == 'DESC'){
                try{
                    cli.action.start('loading file ...');
                    let jsonArray = await csv().fromFile(path);
                    cli.action.stop();
                    try{
                        let result = arraySort(jsonArray, query[6].toLowerCase(), {reverse: true});
                        console.table(result);
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                    catch(err){
                        console.log(chalk.red(err));
                        console.log(chalk.red(`Column ${query[6].toLowerCase()} not found!`));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                catch(err){
                    console.log(chalk.red(err));
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
    // Select particular columns from a file with an order by attribute
    else if(query[1] != undefined && query[1].length > 0 && query[4] == 'ORDER' && query[5] == 'BY' && (query.length == 7 || query.length == 8)){
        path = newPath + '/' + query[3].trim().toLowerCase();
        if(fs.existsSync(path) && query[3].trim().toLowerCase().match('.csv') && query[3].trim().toLowerCase().length > 4){
            if(query[2] == 'FROM' && query.length == 7){
                try{
                    cli.action.start('loading file ...');
                    let jsonArray = await csv().fromFile(path);
                    cli.action.stop();
                    try{
                        let keys = Object.keys(jsonArray[0]);
                        let find = query[1].toLowerCase().trim().split(',');
                        let result = arraySort(jsonArray, query[6].toLowerCase());
                        let printable = [];
                        let flag = 0;
                        for(let i in keys){
                            for(let j in find){
                                if(keys[i] == find[j]){
                                    flag++;
                                }
                            }
                        }
                        if(flag <= keys.length){
                            for(let i in result){
                                let temp = {};
                                for(let j in find){
                                    temp[find[j]] = result[i][find[j]];
                                }
                                printable.push(temp);
                            }
                            console.table(printable);
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        else{
                            console.log(chalk.red('Column not found!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        
                    }
                    catch(err){
                        console.log(chalk.red(err));
                        console.log(chalk.red(`Column ${query[6].toLowerCase()} not found!`));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                catch(err){
                    console.log(chalk.red(err));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else if(query[2] == 'FROM' && query.length == 8 && query[7] == 'DESC'){
                try{
                    cli.action.start('loading file ...');
                    let jsonArray = await csv().fromFile(path);
                    cli.action.stop();
                    try{
                        let keys = Object.keys(jsonArray[0]);
                        let find = query[1].toLowerCase().trim().split(',');
                        let result = arraySort(jsonArray, query[6].toLowerCase(), {reverse: true});
                        let printable = [];
                        let flag = 0;
                        for(let i in keys){
                            for(let j in find){
                                if(keys[i] == find[j]){
                                    flag++;
                                }
                            }
                        }
                        if(flag <= keys.length){
                            for(let i in result){
                                let temp = {};
                                for(let j in find){
                                    temp[find[j]] = result[i][find[j]];
                                }
                                printable.push(temp);
                            }
                            console.table(printable);
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        else{
                            console.log(chalk.red('Column not found!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        
                    }
                    catch(err){
                        console.log(chalk.red(err));
                        console.log(chalk.red(`Column ${query[6].toLowerCase()} not found!`));
                        console.log(chalk.magenta('Press enter to continue'));
                    }
                }
                catch(err){
                    console.log(chalk.red(err));
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
    // Select particular values after joinin two tables
    else if(query[1] != undefined && query[1].length > 0 && query[9] == 'JOIN' && query[11] == 'ON' && query.length == 13){
        path = newPath + '/' + query[8].trim().toLowerCase();
        let secPath = newPath + '/' + query[10].trim().toLowerCase();
        if(fs.existsSync(path) && query[8].trim().toLowerCase().match('.csv') && query[8].trim().toLowerCase().length > 4 && fs.existsSync(secPath) && query[10].trim().toLowerCase().match('.csv') && query[10].trim().toLowerCase().length > 4){
            cli.action.start('loading file ...');
            let jsonArray = await csv().fromFile(path);
            let jsonArray2 = await csv().fromFile(secPath);
            cli.action.stop();
            if(query[2] == 'AS' && query[5] == 'AS' && query[7] == 'FROM'){
                try{
                    let joinOn = query[12].toLowerCase().trim().split('=');
                    if(joinOn.length == 2 && jsonArray[0][query[1].toLowerCase()] && jsonArray2[0][query[4].toLowerCase()]){
                        let data = [];
                        for(let i in jsonArray){
                            let temp = {};
                            for(let j in jsonArray2){
                                if(jsonArray[i][joinOn[0].toLowerCase()] == jsonArray2[j][joinOn[1].toLowerCase()]){
                                    temp[query[3].toLowerCase()] = jsonArray[i][query[1].toLowerCase()];
                                    temp[query[6].toLowerCase()] = jsonArray2[j][query[4].toLowerCase()];
                                }
                            }
                            data.push(temp);
                            temp ={};
                        }
                        if(data.length > 0){
                            console.table(data);
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                        else{
                            console.log(chalk.red('Rows Not Found!'));
                            console.log(chalk.magenta('Press enter to continue'));
                        }
                    }
                    else{
                        console.log(chalk.red('Column Not Found!'));
                        console.log(chalk.magenta('Press enter to continue'));    
                    }
                }
                catch(err){
                    console.log(chalk.red(err));
                    console.log(chalk.magenta('Press enter to continue'));
                }
            }
            else{
                console.log(chalk.red('Command Not Valid!'));
                console.log(chalk.magenta('Press enter to continue'));
            }
        }
        else{
            console.log(chalk.red('File does not exists'));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    else{
        console.log(chalk.red(`Cannot find ${query[1]} from given csv file!`));
        console.log(chalk.magenta('Press enter to continue'));
    }
}