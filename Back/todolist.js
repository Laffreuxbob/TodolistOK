'use strict'

const express = require('express');
const pkg = require('./package.json');
const conf = require('./config.js');

const server = express();

// Liste fictive de taches : bdd mongo pour plus tard
const todos = [
    {
        name: "Linux",
        date: "2018-09-18",
        description: "Installer Linux"
    },
    {
        name: "Test",
        date: "2018-09-18",
        description: "Realiser les tests de qualif"
    },
    {
        name: "Todolist",
        date: "2018-09-18",
        description: "Implementer une todolist en nodeJS"
    }
]

// Methode get pour recuperer la totalite de la liste de taches
server.get('/todos', (req, res) => {
    res.statusCode = 200;
    console.log(todos);
    res.send(todos);
    
});

// Methode get pour recuperer un element par recherche de mot cle
server.get('/todos/:name', (req, res) => {
    const todoToSearch = req.params.name; /* on recupere les mot cle de recherche*/ 
    let todoToDisplay = null; /* on prepare un objet vide pour recuperer une tache si elle existe */
    todos.forEach( item => {
        if(item.name === todoToSearch){
            todoToDisplay = item;
        }
    })
    res.statusCode = 200;
    console.log(todoToDisplay);
    res.send(todoToDisplay);
})

server.post('/todos/add', (req, res) => {
    console.log(req.body)
    res.end();
})


// Le serveur tourne suivant la configuration definie dans config.js
server.listen(conf.port, conf.hostname, (err) => {
    if(err){
        return console.log("Error:", err)
    }
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/');  
})