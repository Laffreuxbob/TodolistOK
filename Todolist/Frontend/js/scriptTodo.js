
function display(){
    fetch('http://127.0.0.1:8080/todos',{method:'get'})
    .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      }).catch(err => {
        console.log('Error occured with fetching ressources')
      });
}

display();
