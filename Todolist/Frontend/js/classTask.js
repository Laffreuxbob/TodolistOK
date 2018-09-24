console.log("taskclass");

class Task {
    constructor(parent,id, name, description) {
        
        this.parent = parent;

        this.id = id;
        this.name = name;
        this.description = description;
        
    }
    
    getData() {
        return [this.name , this.parent, this.id];
    }
    
    create(){
        const main = document.getElementById(this.parent);
        let task = document.createElement('li');
        task.innerHTML = this.name;
        task.id = this.id
        task.className = "popup list-group-item"
        let button = document.createElement('button');
        button.innerHTML = "delete";
        //button.addEventListener("click", () => {console.log("button")})
        button.addEventListener("click", this.delete(this.id))
        
        task.appendChild(button);
        
        main.appendChild(task);
    }
    
    delete(id){
        const main = document.getElementById(this.parent);
        const taskToDelete = document.getElementById(this.id);
        
        // let taskToRemove = document.getElementById(id).remove();
        // taskToDelete.remove();
        //main.removeChile(taskToDelete);
    }
}



/*class Task{
    constructor(name, id){
        this.name = name;
        this.id= id;
    }
    
    create(id){
        const main = document.getElementById(id);
        let task = document.createElement('div');
        task.innerHTML("name");
        let button = document.createElement('button');
        button.innerHTML("clic");
        button.addEventListener("click", () => {console.log("button")})
        
        task.appendChild(button);
        
        main.appendChild(task);
    }
    
    get name(){
        return this.name;
    }
    
    get id(){
        return this.id;
    }
}*/