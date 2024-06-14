// Mengambil elemen tombol tambah, modal, dan formulir
const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector("#close-btn");
const submitForm = document.getElementById("form");
const tasks = [];
const RENDER_EVENT = "render-task";

// Menampilkan modal saat tombol tambah diklik
addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Menutup modal saat area luar modal atau tombol tutup diklik
modal.addEventListener("click", (e) => {
  if (e.target.id === "modal" || e.target.id === "close-btn") {
    modal.style.display = "none";
  }
});
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Membuat objek tugas
function createTaskObject(id, title, description, date) {
  return { id, title, description, date };
}

// Menghasilkan ID unik
function generateID() {
  return +new Date();
}

// Mencegah pengiriman formulir bawaan, validasi, dan tambah tugas
document.addEventListener("DOMContentLoaded", () => {
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  });
  loadDataFromLocalStorage();
});

// Validasi formulir dan tambahkan tugas ke dalam array
function formValidation() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;

  if (!title || !description || !date) {
    alert("Please fill in the form");
    return;
  }

  const task = createTaskObject(generateID(), title, description, date);
  tasks.push(task);
  modal.style.display = "none";
  saveDataToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Render tugas ke dalam elemen container
function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("item");
    taskElement.id = task.id;
    taskElement.innerHTML = `
      <div class="task">
        <h2 class="title">${task.title}</h2>
        <p class="desc">${task.description}</p>
        <p class="date">Date: ${task.date}</p>
      </div>
      <div class="action">
        <i class="bx bx-edit bx-md edit"></i>
        <i class="bx bx-trash bx-md delete"></i>
      </div>
    `;
    // Menambahkan event listener untuk tombol edit
    const editBtn = taskElement.querySelector(".edit");
    editBtn.addEventListener("click", () => editTask(task.id));

    // Menambahkan event listener untuk tombol hapus
    const deleteBtn = taskElement.querySelector(".delete");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskContainer.appendChild(taskElement);
  });
}

document.addEventListener(RENDER_EVENT, () => {
  renderTasks();
});

// Mencari tugas berdasarkan ID
function findTaskById(taskID) {
  return tasks.find((task) => task.id === taskID);
}

// Mengedit tugas
function editTask(taskID) {
  const task = findTaskById(taskID);
  if (!task) return;
  showModalEditTask(task);
}

// Menghapus tugas berdasarkan ID
function deleteTask(taskID) {
  const taskIndex = tasks.findIndex((task) => task.id === taskID);
  if (taskIndex === -1) return;

  tasks.splice(taskIndex, 1);
  saveDataToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Menampilkan modal untuk mengedit tugas
function showModalEditTask(task) {
  // Implementasi logika untuk menampilkan modal dan mengisi form dengan data task yang akan diedit
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("date").value = task.date;
  modal.style.display = "flex";
}

// LOCAL STORAGE

const LOCAL_STORAGE_TASK_KEY = "TASKS";

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveDataToLocalStorage() {
  if (isStorageExist()) {
    //mengubah data array menjadi JSON
    const tasksJSON = JSON.stringify(tasks);

    //menyimpan data ke local storage
    localStorage.setItem(LOCAL_STORAGE_TASK_KEY, tasksJSON);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

//FUNGSI UNTUK MENGAMBIL DATA DARI LOCAL STORAGE
function loadDataFromLocalStorage() {
  if (isStorageExist()) {
    //mengambil data json dari local storage
    const tasksJSON = localStorage.getItem(LOCAL_STORAGE_TASK_KEY);
    if (tasksJSON !== null) {
      const data = JSON.parse(tasksJSON);
      for (const task of data) {
        tasks.push(task);
      }
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }
}
