


function getLang(){
  let lang = document.getElementsByClassName("radioLang");
  console.log(lang)
  
}

getLang();


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

function infosTodo(id){
  let infos = document.getElementById("infos")
  infos.innerHTML = "";
  
  let dataMap = {};
  urls = ['http://127.0.0.1:8080/todos/'+id, 'http://127.0.0.1:8080/todosInfos/'+id];
  
  var promises = urls.map(url => fetch(url)
  .then(data => data.json())
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  }));
  Promise.all(promises).then(results => {
    Object.keys(results).map(function(objectKey, index) {
      var value = results[objectKey];      
      Object.keys(value).map(function(key, item) {
        let val = value[key];
        dataMap[key] = val;
      })
      
    });
    for (let index in dataMap){
      if(index !== "id"){
        let liInfo = document.createElement('li');
        liInfo.className = "list-group-item list-group-item-action";
        
        liInfo.textContent = index + " : " + dataMap[index];
        if(index === "total" || index === "restant"){
          liInfo.textContent += " jours"
          if(parseInt(dataMap[index]) < 0){
            liInfo.style.backgroundColor = '#ff9999'
          }
        }
        infos.appendChild(liInfo)
      }
    }
  });
  
  
  
  // fetch('http://127.0.0.1:8080/todos/' + id, {method:'get'})
  // .then(response =>  response.json())
  // .then(data => {infos.innerHTML = JSON.stringify(data); return data})
  // .then(data => {
  //   //console.log(JSON.stringify(data)),
  //   data1 = JSON.stringify(data);
  //   console.log('data1 : ', data1);
  //   return data1;
  // })
  // .catch(err => {
  //   console.log('Error occured with fetching ressources : ' + err)
  // });
  
  // fetch('http://127.0.0.1:8080/todosInfos/' + id, {method:'get'})
  // .then(response =>  response.json())
  // .then(data => {infos.innerHTML += JSON.stringify(data); return data})
  // .then(data => data)
  // .then(data => {
  //   data2 = JSON.stringify(data);
  //   console.log('data2 : ', data2);
  //   return [data1, data2];
  // })
  // .catch(err => {
  //   console.log('Error occured with fetching ressources : ' + err)
  // });
  
  
  
}

function searchTask(name){
  fetch('http://127.0.0.1:8080/todosSearch/' + name, {method:'get'})
  .then(response =>  response.json())
  .then(data => {  /*console.log(data); */ displaySearch(data)})
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
}

function todoDone(id){
  resetinfosTodo();
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
  console.log("clearInfo")
  let infos = document.getElementById("infos")
  infos.textContent = ""
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
  //.then(data => {console.log(data); displayTodos(data)})
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

function editTodoName(id, newName){
  fetch('http://127.0.0.1:8080/todos/edit/' + id, {
  method:'put',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({"name": String(newName), "date": '//', "description": '//'})
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
  let newDate = (document.getElementById("date").value || "11-09-2020" );
  
  let newName = (document.getElementById("name").value || "default_name");
  
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

}


function displaySearch(data){
  
  let displayResultsSearch = document.createElement('div');
  displayResultsSearch.id = "displayResultsSearch";
  let resultsSearch = document.createElement('div');
  resultsSearch.id = "resultsSearch";
  
  if(data){
    for(let key in data){
      let info = document.createElement('div');
      info.innerHTML = key + " : " + data[key];
      resultsSearch.appendChild(info);
    }
  }else{
    let info = document.createElement('div');
    info.innerHTML = "Aucune correspondance";
    resultsSearch.appendChild(info);
  }
  
  
  let closeButton = document.createElement('button');
  closeButton.addEventListener("click", () => {
    document.getElementById("displayResultsSearch").remove();
  });
  closeButton.innerHTML = "close";
  
  displayResultsSearch.appendChild(resultsSearch);
  resultsSearch.appendChild(closeButton);
  
  document.getElementById("mainContent").appendChild(displayResultsSearch);
  
}


window.onload=function(){
  let inputSearch = document.getElementById("searchTask")
  
  inputSearch.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      console.log(inputSearch.value)
      searchTask(inputSearch.value)
      inputSearch.value = "";
    }
  });
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