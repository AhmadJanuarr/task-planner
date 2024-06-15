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
function createTaskObject(id, title, description, date, statusSelected = null) {
  return { id, title, description, date, statusSelected };
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
  statusSelected();
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
    const taskRow = document.createElement("tr");
    taskRow.classList.add("item");
    taskRow.id = task.id;
    taskRow.innerHTML = `
      <td class="task">
        <i class='bx bxs-right-arrow' style='color:#0a0a0a'></i>
        <span class="title">${task.title}</span>
      </td>
      <td class="status">
        <span id="status" >${task.statusSelected}</span>
      </td>
    `;

    const statusSelect = taskRow.querySelector(".status");
    statusSelect.addEventListener("click", (event) => {
      const modal = document.querySelector(".modal-status");

      if (modal) {
        modal.id = `modal-${task.id}`;
        modal.style.display = "flex";

        // Ambil posisi tombol yang diklik
        const rect = event.target.getBoundingClientRect();
        modal.style.position = "absolute";
        modal.style.top = `${rect.bottom + window.scrollY}px`; // Posisi di bawah tombol
        modal.style.left = `${rect.left + window.scrollX}px`;

        // Tambahkan modal ke dalam dokumen
        document.body.appendChild(modal);
      }
    });

    taskContainer.appendChild(taskRow);
  });
}

document.addEventListener(RENDER_EVENT, () => {
  renderTasks();
});

function statusSelected() {
  const statusList = document.querySelectorAll("ul.status-list li");
  statusList.forEach((status) => {
    status.addEventListener("click", (e) => {
      const taskId = e.target.closest(".modal-status").id.split("-")[1];
      const task = tasks.find((task) => task.id === parseInt(taskId));
      task.statusSelected = e.target.textContent.trim();

      const statusElement = document
        .getElementById(task.id)
        .querySelector("#status");
      statusElement.innerText = task.statusSelected;

      // Remove previous status classes
      statusElement.classList.remove(
        "status-done",
        "status-inprogress",
        "status-notstarted"
      );

      if (task.statusSelected == "Done") {
        statusElement.classList.add("status-done");
      } else if (task.statusSelected == "In progress") {
        statusElement.classList.add("status-inprogress");
      } else if (task.statusSelected == "Not started") {
        statusElement.classList.add("status-notstarted");
      }

      saveDataToLocalStorage();
      document.querySelector(".modal-status").style.display = "none";
    });
  });
}

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
