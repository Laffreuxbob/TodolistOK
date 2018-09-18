'use strict'

const express = require('express');
const pkg = require('./package.json');
const conf = require('./config.js');

const server = express();


const todos = [
    {
        name: "Linux",
        date: "2018-09-18",
        description: "Installer Linux"
    },
    {
        name: "Test",
        date: "2018-09-18",
        description: "Réaliser les tests de qualif"
    },
    {
        name: "Todolist",
        date: "2018-09-18",
        description: "Implémenter une todolist en nodeJS"
    }
]


server.get('/todos', (req, res) => {
    res.statusCode = 200;
    res.send(todos);
    
});

server.get('/todos/:name', (req, res) => {
    const todoToSearch = req.params.name;
    console.log(todoToSearch);
    console.log("---------------------");
    let todoToDisplay = null;
    todos.forEach( item => {
        console.log(item);
        if(item.name.search(todoToSearch)){
            todoToDisplay = item;
        }
    })
    res.statusCode = 200;
    res.send(todoToDisplay)
})






server.listen(conf.port, conf.hostname, (err) => {
    if(err){
        return console.log("Error:", err)
    }
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/');  
})