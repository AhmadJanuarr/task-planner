const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal");

addBtn.addEventListener("click", function () {
  modal.style.display = "flex";
});

modal.addEventListener("click", function (e) {
  if (e.target.id == "modal" || e.target.id == "close-btn") {
    modal.style.display = "none";
  }
});

const tasks = [];
const RENDER_EVENT = "render-task";
function taskObject(id, title, description, date) {
  return {
    id,
    title,
    description,
    date,
  };
}
function genereteID() {
  return +new Date();
}
function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;
  const id = genereteID();
  const isCompleted = false;
  const task = taskObject(id, title, description, date, isCompleted);

  if (title === "" || description === "" || date === "") {
    alert("Please fill in the form");
  } else {
    tasks.push(task);
    console.log(tasks);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

const submitForm = document.getElementById("form");

submitForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("form submitted");
  addTask();
  modal.style.display = "none";
});

function renderTask() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.innerHTML = " ";
  for (const task of tasks) {
    taskContainer.innerHTML += `
         <div class="item" id="${task.id}">
            <div class="task">
              <h2>${task.title}</h2>
              <p>${task.description}</p>
              <p>${task.date}</p>
            </div>
            <div class="action">
              <i class="bx bx-edit bx-md edit"></i>
              <i class="bx bx-trash bx-md delete" "></i>
            </div>
          </div>
        `;
    const editBtn = document.querySelector(".edit");
    editBtn.addEventListener("click", function () {
      editTask(task.id);
    });

    const deleteBtn = document.querySelector(".delete");
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });
  }
}

function findTaskId(taskID) {
  for (const task of tasks) {
    if (task.id === taskID) {
      return task;
    }
  }
}

function editTask(taskID) {
  const taskTarget = findTaskId(taskID);
  if (taskTarget == null) return;
  modalEditTask(taskTarget);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteTask(taskID) {
  const taskTarget = findTaskId(taskID);

  if (taskTarget == null) return;
  tasks.splice(taskTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  renderTask();
});
