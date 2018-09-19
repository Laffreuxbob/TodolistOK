'use strict'

const express = require('express');
const pkg = require('./package.json');
const conf = require('./config.js');

const bodyPost = require('body-parser');

const server = express();

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

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

//const todos = [];



// -> 127.0.0.1:8080/version
server.get('/version', (req, res) => {
    if (!pkg || !pkg.version) {
        console.log('Error: No package.json');
        res.status(404);
        return res.send();
    }
    res.status(200);
    console.log('version: ' + pkg.version);
    res.send({ version: pkg.version });
})

// Methode get pour recuperer la totalite de la liste de taches
server.get('/todos', (req, res) => {
    if (!todos) {
        res.status(200)
        console.log("Liste inexstante");
        return res.send({})
    }
    
    res.status(200)

    console.log('Liste de taches :')
    console.log(todos || "Liste de taches vide");
    console.log('------------------------')

    res.send(todos || {})
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
    console.log('Resultat de la cherche avec le mot : ' + todoToSearch)
    console.log(todoToDisplay || 'Aucun resultat pour cette recherche');
    console.log('------------------------')
    res.send(todoToDisplay);
})

server.post('/todos/add', (req, res) => {
    //const body = req.body;
    //console.log(body);

    let newName = "Nn";
    let newDate = "Dd";
    let newDescription = "DESdes";
    let newItem = {
        "name":newName,
        "date":newDate,
        "description":newDescription
    }
    todos.push(newItem);
    console.log(newItem);
    res.send(newName + ' ' + newDate + ' ' + newDescription);
    res.end();
})


// Le serveur tourne suivant la configuration definie dans config.js
server.listen(conf.port, conf.hostname, (err) => {
    if(err){
        return console.log("Error:", err)
    }
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/');  
})