'use strict'

const express = require('express');
const pkg = require('./package.json');
const conf = require('./config.js');
const moment = require('moment');

const bodyPost = require('body-parser');

const server = express();

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

// Liste fictive de taches : bdd mongo pour plus tard
const todos = [
    {
        name: "Linux",
        date: "18-09-2018",
        ajout: "12-09-2018",
        description: "Installer Linux"
    },
    {
        name: "Test",
        date: "18-09-2018",
        ajout: "13-09-2018",
        description: "Realiser les tests de qualif"
    },
    {
        name: "Todolist",
        date: "18-09-2018",
        ajout: "16-09-2018",
        description: "Implementer une todolist en nodeJS"
    }
]

//const todos = [];



// curl http://127.0.0.1:8080/version
server.get('/version', (req, res) => {
    if (!pkg || !pkg.version) {
        console.log('Error: No package.json');
        res.status(404);
        return res.send();
    }
    res.status(200);
    console.log('version: ' + pkg.version);
    res.send('version : ' +  pkg.version + '\n').end()
})

// Methode get pour recuperer la totalite de la liste de taches
server.get('/todos', (req, res) => {
    if (!todos) {
        res.status(200);
        console.log("Liste inexstante");
        return res.send({} + '\n');
    }
    
    res.status(200)

    console.log('Liste de taches :')
    console.log(todos || "Liste de taches vide");
    console.log('------------------------')
    //res.send(todos || {})
    res.send("Taille : " + todos.length + '\n').end();
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
    res.status(200);
    console.log('Resultat de la cherche avec le mot : ' + todoToSearch)
    console.log(todoToDisplay || 'Aucun resultat pour cette recherche');
    console.log('------------------------')
    res.send(JSON.stringify(todoToDisplay) + '\n').end();
})

// Methode POST pour ajouter un nouvel element a la liste en cours
// curl http://127.0.0.1:8080/todos/add -X POST -d name='NAME' -d date='DATE' -d description='DES'
//curl -d '{"name":"NouveauProjet", "date":"25-09-2019", "description":"Projet test delai"}' -H "Content-Type: application/json" -X POST http://localhost:8080/todos/add
server.post('/todos/add', (req, res) => {
   
    const data = req.body; // recuperation des donnees dans le body de la requete

    /* attribution des nouvelles key_value*/ 
    let newName = data.name;
    let newDate = data.date;
    let newDescription = data.description;

    /* creation du nouvel objet tache */
    let newItem = {
        "name":newName,
        "date":newDate,
        "ajout": moment().format('DD-MM-YYYY'),
        "description":newDescription
    }
    /* ajout a la liste */
    todos.push(newItem);
    
    res.status(200);

    res.write("Nouvelle entree enregistree : \n")
    res.write(JSON.stringify(newItem) + '\n')
    res.end();
})

// Methode delete pour supprimer un element de la liste avec un mot cle
// curl -X DELETE  http://127.0.0.1:8080/delete/name
server.delete('/delete/:todoToDelete', (req, res) => {
    const todoToDelete = req.params.todoToDelete
    todos.forEach( item => {
        if(item.name === todoToDelete){
            console.log("Suppresion du projet :" + item.name);
            let index = todos.indexOf(item);
            todos.splice(index,1);
        }
    })
    res.status(410); //status de suppression de data du serveur
    res.end();
})

// Methode qui renvoie des informations temporelles liees a la tache (delai etc...)
// curl http://127.0.0.1:8080/todosInfos/name
server.get('/todosInfos/:name', (req, res) => {
    const todoToSearch = req.params.name; /* on recupere les mot cle de recherche*/ 
    let todoToGet = null; /* on prepare un objet vide pour recuperer une tache si elle existe */
    todos.forEach( item => {
        if(item.name === todoToSearch){
            todoToGet = item;
        }
    })
    res.status(200);
    
    let dateEnd = moment(todoToGet.date,"DD-MM-YYYY" )
    let dateStart = moment(todoToGet.ajout,"DD-MM-YYYY" )

    let timeAll = dateEnd.diff(dateStart) / (1000 * 60 * 60 * 24);
    let timeLeft = Math.trunc(dateEnd.diff(moment()) / (1000 * 60 * 60 * 24));

    console.log('Delai total pour la tache ' + todoToSearch + " : " + timeAll + "jour(s)")
    console.log('Delai restant pour la tache ' + todoToSearch + " : " + timeLeft + "jour(s)")
    console.log('------------------------' + '\n')
    //res.send(JSON.stringify(todoToDisplay) + '\n').end();
    res.end();
})

// Le serveur tourne suivant la configuration definie dans config.js
server.listen(conf.port, conf.hostname, (err) => {
    if(err){
        return console.log("Error:", err)
    }
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/'); 
    console.log('today : ' + moment().format('DD-MM-YYYY hh:mm')) 
})