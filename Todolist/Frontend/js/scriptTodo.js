


function getTodos(){
    fetch('http://127.0.0.1:8080/todos/')
    .then(response =>  response.json())
    .then(data => {console.log(data);})
    .then(data => data)
    .catch(err => {
      console.log('Error occured with fetching ressources : ' + err)
    });
}

getTodos();




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