const fs = require('fs');
const chalk = require('chalk');
const {cli} = require('cli-ux');
const csv = require('csvtojson');
const cTable = require('console.table');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const select = require('./select');
const create = require('./create');
const drop = require('./drop');
const insert = require('./insert');
const update = require('./update');
const del = require('./delete');

module.exports = async function (input, path) {
    let newInput = input.replace(/  +/g, ' ');
    let query = newInput.toUpperCase().split(' ');
    let lastWord = query.pop();
    if((lastWord.length - 1) > 0){
        query.push(lastWord.substring(0 , lastWord.length - 1));
    }
    if(query[0] != undefined && query[0] == 'SELECT'){
        select(query, path);
    }
    else if(query[0] == 'CREATE' && query[1] == 'TABLE'){
        create(query, path);
    }
    else if(query[0] == 'DROP' && query[1] == 'TABLE'){
        drop(query, path);
    }
    else if(query[0] == 'INSERT' && query[1] == 'INTO' && query.length == 6){
        insert(query, path);
    }
    else if(query[0] == 'UPDATE' && query.length == 6){
        update(query, path);        
    }
    else if(query[0] == 'DELETE' && query[1] == 'FROM' && query.length == 5){
        del(query, path);        
    }
    else{
        console.log(chalk.red('Command not found! :'));
        console.log(chalk.red('-> Please make sure that you have used ; character in the end.'));
        console.log(chalk.red('-> and .csv of te file in the end if using it.'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}