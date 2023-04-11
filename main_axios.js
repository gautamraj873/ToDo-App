let form = document.getElementById('form');
let textInput = document.getElementById('textInput');
let dateInput = document.getElementById('dateInput');
let textArea = document.getElementById('textArea');
let msg = document.getElementById('msg');
let tasks = document.getElementById('tasks')
let add = document.getElementById('add');
let completedTasks = document.getElementById('completedTasks');
let url = 'https://crudcrud.com/api/4095fe6a0df2461593c7d1fce52aab57/task';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    formValidation();
});


let formValidation = () => {
    if (textInput.value === '') {
        msg.innerHTML = "Task cannot be blank";
    } else {
        msg.innerHTML = "";
        acceptData();
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();

        (() => {
            add.setAttribute("data-bs-dismiss", "");
        })()
    }
}


let data = [];

let acceptData = () => {
    const task = {
        text: textInput.value,
        date: dateInput.value,
        description: textArea.value,
        completed: false
    };

    axios.post(url, task)
        .then((response) => {
            console.log(response);
            data.push(response.data);
            createTasks();
        })
        .catch(error => console.error(error));
}

let createTasks = () => {
    tasks.innerHTML = "";
    completedTasks.innerHTML = "";
    axios.get(url)
        .then((response) => {
            console.log(response);
            data.forEach((task, index) => {
                if (task.completed) {
                    return (completedTasks.innerHTML +=
                        `<div id=${index}>
                        <span>
                            <input onClick="completedTask(this)" type="checkbox" name="" id="checkBox${index}">
                        </span>    
                        <span class="fw-bold">${task.text}</span>
                        <span class="small text-secondary">${task.date}</span>
                        <p>${task.description}</p>
                        <span class="options">
                            <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
                            <i onClick="deleteTask(this)" class="fa-solid fa-trash"></i>
                        </span>
                    </div>`)
                } else {
                    return (tasks.innerHTML +=
                        `<div id=${index}>
                        <span>
                            <input onClick="completedTask(this)" type="checkbox" name="" id="checkBox${index}">
                        </span>    
                        <span class="fw-bold">${task.text}</span>
                        <span class="small text-secondary">${task.date}</span>
                        <p>${task.description}</p>
                        <span class="options">
                            <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
                            <i onClick="deleteTask(this)" class="fa-solid fa-trash"></i>
                        </span>
                    </div>`)
                }
            })
        })
        .catch((error) => {
            console.error(error);
        });

    resetForm();
}

let deleteTask = (e) => {
    let selectedTask = e.parentElement.parentElement;
    selectedTask.remove();
    axios.delete(`${url}/${data[selectedTask.id]._id}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
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
    //console.log(e.checked);
    if (e.checked == true) {
        axios.put(`${url}/${data[selectedTask.id]._id}`, {
            text: data[selectedTask.id].text,
            date: data[selectedTask.id].date,
            description: data[selectedTask.id].description,
            completed: true
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
            completedTasks.appendChild(selectedTask);
    } else {
        axios.put(`${url}/${data[selectedTask.id]._id}`, {
            text: data[selectedTask.id].text,
            date: data[selectedTask.id].date,
            description: data[selectedTask.id].description,
            completed: false
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

(() => {
    axios.get(url)
        .then((response) => {
            data = response.data;
            createTasks();
        })
        .catch((error) => {
            console.error(error);
        })
})();