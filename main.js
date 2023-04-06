let form = document.getElementById('form');
let textInput = document.getElementById('textInput');
let dateInput = document.getElementById('dateInput');
let textArea = document.getElementById('textArea');
let msg = document.getElementById('msg'); 
let tasks = document.getElementById('tasks')
let add = document.getElementById('add');
let completedTasks = document.getElementById('completedTasks');


form.addEventListener('submit',(e) => {
    e.preventDefault();
    formValidation();
});

let formValidation = () => {
    if(textInput.value === ''){
        //console.log('failure');
        msg.innerHTML = "Task cannot be blank";
    }
    else{
        //console.log('success');
        msg.innerHTML = "";
        acceptData();
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();

        (() => {
            add.setAttribute("data-bs-dismiss", "");
        })()
    }
}

let data = [{}];

let acceptData = () => {
    data.push({
        text : textInput.value,
        date : dateInput.value,
        description : textArea.value,
        completed: false
    });
    
    localStorage.setItem("data", JSON.stringify(data));

    //console.log(data);
    createTasks();
}

let createTasks = () => {
    tasks.innerHTML = "";
    completedTasks.innerHTML = "";
    data.map((x, y) => {
        if(x.completed){
            return (completedTasks.innerHTML += 
                `<div id=${y}>
                    <span>
                        <input onClick="completedTask(this)" type="checkbox" name="" id="checkBox${y}">
                    </span>    
                    <span class="fw-bold">${x.text}</span>
                    <span class="small text-secondary">${x.date}</span>
                    <p>${x.description}</p>
                    <span class="options">
                        <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
                        <i onClick="deleteTask(this);createTasks()" class="fa-solid fa-trash"></i>
                    </span>
                </div>`)
        }
        else{
            return (tasks.innerHTML += 
                `<div id=${y}>
                    <span>
                        <input onClick="completedTask(this)" type="checkbox" name="" id="checkBox${y}">
                    </span>    
                    <span class="fw-bold">${x.text}</span>
                    <span class="small text-secondary">${x.date}</span>
                    <p>${x.description}</p>
                    <span class="options">
                        <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
                        <i onClick="deleteTask(this);createTasks()" class="fa-solid fa-trash"></i>
                    </span>
                </div>`)
        }
    })
    
    resetForm();
}

let deleteTask = (e) => {
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id, 1)
    localStorage.setItem("data", JSON.stringify(data));
    //console.log(data);
}

let editTask = (e) => {
    let selectedTask = e.parentElement.parentElement;

    textInput.value = selectedTask.children[1].innerHTML;
    dateInput.value = selectedTask.children[2].innerHTML;
    textArea.value = selectedTask.children[3].innerHTML;
    deleteTask(e);
}

let resetForm = () => {
    textInput.value = '';
    dateInput.value = '';
    textArea.value = '';
}

let completedTask = (e) => {
    let selectedTask = e.parentElement.parentElement;
    if(e.checked == true){
        completedTasks.appendChild(selectedTask);
        data[selectedTask.id].completed = true;
        localStorage.setItem("data", JSON.stringify(data));
    }
    else{
        tasks.appendChild(selectedTask);
        data[selectedTask.id].completed = false;
        localStorage.setItem("data", JSON.stringify(data));
    }
}

(() => {
    data = JSON.parse(localStorage.getItem('data')) || [];
    //console.log(data);
    createTasks();
})();