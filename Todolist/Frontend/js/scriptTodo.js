function getTodos(){
  fetch('http://127.0.0.1:8080/todos/', {method:'get'})
  .then(response =>  response.json())
  .then(data => {/*console.log(data);*/ displayTodos(data)})
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
}

getTodos();

function displayTodos(obj){
  let mainToDisplay = document.getElementById("todoListDisplay");
  let mainToDisplayDone = document.getElementById("todoListDisplayDone");
  
  for(key in obj){
    let parent = (obj[key].done ? "todoListDisplayDone" : "todoListDisplay")
    let task = new Task(parent,obj[key].id, obj[key].name, obj[key].description);
    task.create();
    //console.log(task)
    
  }
}

function infosTodo(){
  let infos = document.getElementById("infos")
  infos.innerHTML = "";
  fetch('http://127.0.0.1:8080/todos/' + this.id, {method:'get'})
  .then(response =>  response.json())
  .then(data => { /*console.log(data);*/ infos.innerHTML = JSON.stringify(data); })
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
  
  fetch('http://127.0.0.1:8080/todosInfos/' + this.id, {method:'get'})
  .then(response =>  response.json())
  .then(data => {/*console.log(data);*/ infos.innerHTML += JSON.stringify(data); })
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
  
}

function todoDone(id){
  console.log("done")
  fetch('http://127.0.0.1:8080/todos/editDone/' + id, {
  method:'put',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  //body:JSON.stringify({"name": editName, "date": String(editDate), "description": editDescription})
})
.then(response =>  response.json())
.then(data => {console.log(data); displayTodos(data)})
.then(data => data)
.catch(err => {
  console.log('Error occured with fetching ressources : ' + err)
});
}

function resetinfosTodo(){
  let infos = document.getElementById("infos")
  infos.innerHTML = ""
}

function getVersion(){
  fetch('http://127.0.0.1:8080/version/', {method:'get'})
  .then(response =>  response.json())
  .then(data => {alert("Version : " + JSON.stringify(data));})
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
  
}

function deleteTodo(id){

  fetch('http://127.0.0.1:8080/delete/' + id, {method:'delete'})
  .then(response =>  response.json())
  .then(data => {console.log(data); displayTodos(data)})
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
}

function editTodo(){
  console.log(this.id)
  let editName = document.getElementById("name").value;
  let editDate = dateFR(document.getElementById("date").value);
  let editDescription = document.getElementById("description").value;
  fetch('http://127.0.0.1:8080/todos/edit/' + this.id, {
  method:'put',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({"name": editName, "date": String(editDate), "description": editDescription})
})
.then(response =>  response.json())
.then(data => {console.log(data); displayTodos(data)})
.then(data => data)
.catch(err => {
  console.log('Error occured with fetching ressources : ' + err)
});
//document.location.reload();
}

function dateFR(date){
  dateArray = date.split('-');
  dateFR = "";
  for (let i = 2; i > -1; i--){
    //console.log(dateArray[i] )
    dateFR += dateArray[i] 
    if(i === 2 || i === 1){
      dateFR += "-";
    }
  }
  //console.log(dateFR)
  return dateFR;
}

function addTodo(){
  
  let main = document.getElementById("todoListDisplay");
  
  let newName = (document.getElementById("name").value || "default_name");
  let newDate = (/*dateFR*/(document.getElementById("date").value) || "11-09-2020");
  let newDescription = (document.getElementById("description").value || "default_description");
  
  fetch('http://127.0.0.1:8080/todos/add', {
  method:'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({"name": newName, "date": newDate, "description": newDescription})
})
.then(response =>  response.json())
//.then(data => {console.log(data);})
.then(data => data)
.then( () => {
  console.log(newName);
  let task = new Task("todoListDisplay",null, newName, newDescription);
  task.create();
}
)
.catch(err => {
  console.log('Error occured with fetching ressources : ' + err)
});
//document.location.reload();

}

function test(){
  console.log("test")
}



































// function createGist(opts) {
//   fetch('https://api.github.com/gists', {
//     method: 'post',
//     body: JSON.stringify(opts)
//   }).then(function(response) {
//     return response.json();
//   }).then(function(data) {
//     ChromeSamples.log('Created Gist:', data.html_url);
//   });
// }

// function submitGist() {
//   var content = document.querySelector('textarea').value;
//   if (content) {
//     createGist({
//       description: 'Fetch API Post example',
//       public: true,
//       files: {
//         'test.js': {
//           content: content
//         }
//       }
//     });
//   } else {
//     ChromeSamples.log('Please enter in content to POST to a new Gist.');
//   }
// }

// var submitBtn = document.querySelector('button');
// submitBtn.addEventListener('click', submitGist);

// fetch('./api/some.json')
//   .then(
//     function(response) {
//       if (response.status !== 200) {
//         console.log('Looks like there was a problem. Status Code: ' +
//           response.status);
//         return;
//       }

//       // Examine the text in the response
//       response.json().then(function(data) {
//         console.log(data);
//       });
//     }
//   )
//   .catch(function(err) {
//     console.log('Fetch Error :-S', err);
//   });