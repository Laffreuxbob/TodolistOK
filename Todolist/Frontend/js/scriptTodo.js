
function display(){
    fetch('http://127.0.0.1:8080/todos',{method:'get'})
    .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        return json;
      }).catch(err => {
        console.log('Error occured with fetching ressources : ' + err)
      });
}

display();
