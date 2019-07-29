// Installed Dependencies
const chalk = require('chalk');

// Required Module Exports
const select = require('./select');
const create = require('./create');
const drop = require('./drop');
const insert = require('./insert');
const update = require('./update');
const del = require('./delete');

// Function to check which query is fired
// It will send the query to the required statement.js file
// @returns values depending on the query
module.exports = async function (input, path) {
    let newInput = input.replace(/  +/g, ' ');
    let query = newInput.toUpperCase().split(' ');
    let lastWord = query.pop();
    if((lastWord.length - 1) > 0){
        query.push(lastWord.substring(0 , lastWord.length - 1));
    }
    // Check whether the SQL Query is a SELECT Statement
    if(query[0] != undefined && query[0] == 'SELECT'){
        select(query, path);
    }
    // Check whether the SQL Query is a CREATE Statement
    else if(query[0] == 'CREATE' && query[1] == 'TABLE'){
        create(query, path);
    }
    // Check whether the SQL Query is a DROP Statement
    else if(query[0] == 'DROP' && query[1] == 'TABLE'){
        drop(query, path);
    }
    // Check whether the SQL Query is a INSERT Statement
    else if(query[0] == 'INSERT' && query[1] == 'INTO' && query.length == 6){
        insert(query, path);
    }
    // Check whether the SQL Query is a UPDATE Statement
    else if(query[0] == 'UPDATE' && query.length == 6){
        update(query, path);        
    }
    // Check whether the SQL Query is a DELETE Statement
    else if(query[0] == 'DELETE' && query[1] == 'FROM' && query.length == 5){
        del(query, path);        
    }
    // If no statement is found
    else{
        console.log(chalk.red('Command not found! :'));
        console.log(chalk.red('-> Please make sure that you have used ; character in the end.'));
        console.log(chalk.red('-> and .csv of te file in the end if using it.'));
        console.log(chalk.magenta('Press enter to continue'));
    }
}