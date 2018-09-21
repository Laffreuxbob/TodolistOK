'use strict'

const express = require('express'); // Framework gestion serveur nodeJS
const pkg = require('./package.json'); // Pour pouvoir lire les data Json
const conf = require('./config.js'); // IP et port de notre serveur
const moment = require('moment'); // Librairie gestion de dates

const bodyPost = require('body-parser'); // Necessaire a la lecture des data dans le body de la requete (post)

const server = express();

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

server.use((req, res, next) => {
    res.header('Content-Type', 'application/json')
    next()
})

// Facon presque propre d'eviter le probleme de header CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
server.use(allowCrossDomain);

// Liste fictive de taches : bdd mongo pour plus tard
const todos = [
    {
        name: "Linux",
        date: "18-09-2018",
        ajout: "12-09-2018",
        description: "Installer Linux",
        done: false
    },
    {
        name: "Test",
        date: "18-09-2018",
        ajout: "13-09-2018",
        description: "Realiser les tests de qualif",
        done: false
    },
    {
        name: "Todolist",
        date: "18-09-2018",
        ajout: "16-09-2018",
        description: "Implementer une todolist en nodeJS",
        done: false
    },
    {
        name: "Alternance",
        date: "11-09-2020",
        ajout: "12-09-2018",
        description: "Apprendre plein de trucs trop bien",
        done: false
    }
]

// const todos = [
//     {
//         "name": "Linux",
//         "date": "18-09-2018",
//         "ajout": "12-09-2018",
//         "description": "Installer Linux"
//     },
//     {
//         "name": "Test",
//         "date": "18-09-2018",
//         "ajout": "13-09-2018",
//         "description": "Realiser les tests de qualif"
//     },
//     {
//         "name": "Todolist",
//         "date": "18-09-2018",
//         "ajout": "16-09-2018",
//         "description": "Implementer une todolist en nodeJS"
//     },
//     {
//         "name": "Alternance",
//         "date": "11-09-2020",
//         "ajout": "12-09-2018",
//         "description": "Apprendre plein de trucs trop bien"
//     }
// ]

// Methode GET pour recuperer la version du projet
// curl http://127.0.0.1:8080/version
server.get('/version', (req, res) => {
    if (!pkg || !pkg.version) {
        console.log('Error: No package.json');
        res.status(404);
        return res.send();
    }
    res.status(200);
    console.log('version: ' + pkg.version);
    //res.send('version : ' +  pkg.version + '\n').end()
    res.send(JSON.stringify(pkg.version) ).end()
    
})

// Methode GET pour recuperer la totalite de la liste de taches
// curl http://127.0.0.1:8080/todos
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
    //res.send(JSON.stringify({'toto': 'titi'}))
    res.send(JSON.stringify(todos))
    //res.send("Taille : " + todos.length + '\n').end();
});

// Methode GET pour recuperer un element par recherche de mot cle
// curl http://127.0.0.1:8080/todos/Linux
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
    res.send(JSON.stringify(todoToDisplay)).end();
})

// Methode POST pour ajouter un nouvel element a la liste en cours
// curl -X POST -H "Content-Type: application/json" -d '{"name":"NouveauProjet", "date":"25-09-2019", "description":"Projet test delai"}' http://localhost:8080/todos/add
server.post('/todos/add', (req, res) => {
    
    const data = req.body; // recuperation des donnees dans le body de la requete
    
    // attribution des nouvelles key_value  
    let newName = (data.name || "default_name");
    let newDate = (data.date || "11-09-2020");
    let newDescription = (data.description || "default_description");
    
    // creation du nouvel objet tache 
    let newItem = {
        "name":newName,
        "date":newDate,
        "ajout": moment().format('DD-MM-YYYY'),
        "description":newDescription,
        "done": false
    }
    // ajout a la liste 
    todos.push(newItem);
    
    res.status(200);
    
    //res.write("Nouvelle entree enregistree : \n")
    //res.write(JSON.stringify(newItem) + '\n')
    console.log(JSON.stringify(newItem))
    res.send(JSON.stringify(newItem))
    res.end();
})

// Methode DELETE pour supprimer un element de la liste avec un mot cle
// curl -X DELETE  http://127.0.0.1:8080/delete/Test
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

// Methode qui renvoie des informations temporelles liees a la tache (delais etc...)
// curl http://127.0.0.1:8080/todosInfos/Alternance
server.get('/todosInfos/:name', (req, res) => {
    
    const todoToSearch = req.params.name; // on recupere les mot cle de recherche
    let todoToGet = null; // on prepare un objet vide pour recuperer une tache si elle existe 
    
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
    
    res.send( {"total":timeAll, "restant":timeLeft})
    res.end();
})


// Methode d'edition et de mise a jour d'une tache (on utilise le // pour garder la valeur actuelle)
// curl -X PUT -H "Content-Type: application/json" -d '{"name":"editedName","date":"editedDate","description":"//"}' "http://localhost:8080/todos/edit/Linux"

server.put('/todos/edit/:name', (req, res) => {
    
    let nameToEdit = req.params.name;
    let todoToEdit = null;
    let index = null;
    
    todos.forEach( item => {
        if(item.name === nameToEdit){
            todoToEdit = item;
            index = todos.indexOf(item);
        } 
    })
    
    let datas = req.body;
    
    /* attribution des nouvelles key_value editees */ 
    let editedName = (datas.name === "//" || "" ?  todoToEdit.name : datas.name);
    let editedDate = (datas.date === "//" || "" ?  todoToEdit.date : datas.date);
    let editedDescription = (datas.description === "//" || "" ? todoToEdit.description : datas.description);
    
    /* creation du nouvel objet tache */
    let editedItem = {
        "name":editedName,
        "date":editedDate,
        "ajout": todoToEdit.ajout,
        "description":editedDescription,
        "done": false
    }
    
    // Edition de la nouvelle tache
    todos[index] = editedItem;
    
    // res.write(JSON.stringify("to edit : " + JSON.stringify(todoToEdit)) + '\n');
    // res.write(JSON.stringify(" edited : " + JSON.stringify(editedItem)) + '\n');
    
    res.status(200);
    res.end();
})

server.put('/todos/editDone/:name', (req, res) => {
    
    let nameToEdit = req.params.name;
    let todoToEdit = null;
    let index = null;
    
    todos.forEach( item => {
        if(item.name === nameToEdit){
            todoToEdit = item;
            index = todos.indexOf(item);
        } 
    })
    
    let datas = req.body;
    
    /* creation du nouvel objet tache */
    let editedItem = {
        "name":todoToEdit.name,
        "date":todoToEdit.date,
        "ajout": todoToEdit.ajout,
        "description":todoToEdit.description,
        "done": !todoToEdit.done
    }
    
    // Edition de la nouvelle tache
    todos[index] = editedItem;
    
    // res.write(JSON.stringify("to edit : " + JSON.stringify(todoToEdit)) + '\n');
    // res.write(JSON.stringify(" edited : " + JSON.stringify(editedItem)) + '\n');
    
    res.status(200);
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