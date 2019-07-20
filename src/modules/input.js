const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');
const csv = require('csvtojson');
const arraySort = require('array-sort');
const cTable = require('console.table');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

module.exports = async function (input, path) {
    let newInput = input.replace(/  +/g, ' ');
    let query = newInput.toUpperCase().split(' ');
    let lastWord = query.pop();
    if((lastWord.length - 1) > 0){
        query.push(lastWord.substring(0 , lastWord.length - 1));
    }
    if(query[0] != undefined && query[0] == 'SELECT'){
        let fileindex = path.lastIndexOf('/');
        let newPath = path.substring(0, fileindex).trim();
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
                                    tempArray.push(jsonArray[i][data[j]]);
                                }
                                printable.push(tempArray);
                                tempArray = [];
                            }
                            cli.action.stop();
                            console.log();
                            console.table(data, printable);
                            printable = [];
                            console.log(chalk.magenta('Press enter to continue'));
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
        else{
            console.log(chalk.red(`Cannot find ${query[1]} from given csv file!`));
            console.log(chalk.magenta('Press enter to continue'));
        }
    }
    else if(query[0] == 'CREATE' && query[1] == 'TABLE'){
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
    else if(query[0] == 'DROP' && query[1] == 'TABLE'){
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
    else if(query[0] == 'INSERT' && query[1] == 'INTO' && query.length == 6){
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
                let invalidValues = false;
                for(let i in record){
                    if(data.length != record[i].length){
                        invalidValues = true;
                        break;
                    }
                }
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
    else if(query[0] == 'UPDATE' && query.length == 6){
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
    else if(query[0] == 'DELETE' && query[1] == 'FROM' && query.length == 5){
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
    else{
        console.log(chalk.red('Command not found! :'));
        console.log(chalk.red('-> Please make sure that you have used ; character in the end.'));
        console.log(chalk.red('-> and .csv of te file in the end if using it.'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}