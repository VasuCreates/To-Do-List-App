particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
  },
  retina_detect: true,
});

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const taskStats = document.getElementById("task-stats");
const clearCompletedBtn = document.getElementById("clear-completed");
const filters = document.querySelectorAll(".filter");

let currentFilter = "all";

function addTask() {
  if (inputBox.value.trim() === "") {
    showErrorMessage("Please enter a task!");
    inputBox.focus();
    return;
  }

  let li = document.createElement("li");

  let taskText = document.createElement("div");
  taskText.className = "task-text";
  taskText.textContent = inputBox.value;
  li.appendChild(taskText);

  let editBtn = document.createElement("span");
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.className = "edit-btn";
  li.appendChild(editBtn);

  let deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
  deleteBtn.className = "delete-btn";
  li.appendChild(deleteBtn);

  listContainer.appendChild(li);

  inputBox.value = "";
  inputBox.focus();
  saveData();
  updateTaskCount();
  applyFilter();
}

function showErrorMessage(message) {
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

  const rowElement = document.querySelector(".row");
  rowElement.parentNode.insertBefore(errorDiv, rowElement.nextSibling);

  setTimeout(() => {
    errorDiv.style.opacity = "0";
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 300);
  }, 3000);
}

function editTask(element) {
  const taskTextElement = element.querySelector(".task-text");
  const currentText = taskTextElement.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = currentText;

  taskTextElement.replaceWith(input);
  input.focus();

  function saveEdit() {
    const newTaskText = document.createElement("div");
    newTaskText.className = "task-text";

    const newText = input.value.trim();
    newTaskText.textContent = newText !== "" ? newText : currentText;

    input.replaceWith(newTaskText);
    saveData();
  }

  input.addEventListener("blur", saveEdit);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      const newTaskText = document.createElement("div");
      newTaskText.className = "task-text";
      newTaskText.textContent = currentText;
      input.replaceWith(newTaskText);
    }
  });
}

listContainer.addEventListener("click", function (e) {
  if (
    e.target.tagName === "LI" ||
    (e.target.tagName === "DIV" && e.target.classList.contains("task-text"))
  ) {
    const li = e.target.tagName === "LI" ? e.target : e.target.parentElement;
    li.classList.toggle("checked");
    saveData();
    updateTaskCount();
    applyFilter();
  } else if (
    e.target.classList.contains("delete-btn") ||
    (e.target.tagName === "I" &&
      e.target.parentElement.classList.contains("delete-btn"))
  ) {
    const li = e.target.closest("li");

    li.style.opacity = "0";
    li.style.transform = "translateX(30px)";

    setTimeout(() => {
      li.remove();
      saveData();
      updateTaskCount();
    }, 300);
  } else if (
    e.target.classList.contains("edit-btn") ||
    (e.target.tagName === "I" &&
      e.target.parentElement.classList.contains("edit-btn"))
  ) {
    editTask(e.target.closest("li"));
  }
});

clearCompletedBtn.addEventListener("click", function () {
  const completedTasks = listContainer.querySelectorAll("li.checked");

  completedTasks.forEach((task) => {
    task.style.opacity = "0";
    task.style.transform = "translateX(30px)";

    setTimeout(() => {
      task.remove();
      saveData();
      updateTaskCount();
    }, 300);
  });
});

filters.forEach((filter) => {
  filter.addEventListener("click", function () {
    filters.forEach((f) => f.classList.remove("active"));
    this.classList.add("active");

    currentFilter = this.getAttribute("data-filter");
    applyFilter();
  });
});

function applyFilter() {
  const tasks = listContainer.querySelectorAll("li");

  tasks.forEach((task) => {
    switch (currentFilter) {
      case "all":
        task.style.display = "block";
        break;
      case "pending":
        task.style.display = task.classList.contains("checked")
          ? "none"
          : "block";
        break;
      case "completed":
        task.style.display = task.classList.contains("checked")
          ? "block"
          : "none";
        break;
    }
  });
}

function updateTaskCount() {
  const total = listContainer.querySelectorAll("li").length;
  const completed = listContainer.querySelectorAll("li.checked").length;
  const remaining = total - completed;

  taskStats.textContent = `${remaining} task${
    remaining !== 1 ? "s" : ""
  } remaining`;
}

function saveData() {
  localStorage.setItem("todonest-data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("todonest-data") || "";
  updateTaskCount();
  applyFilter();
}

document.addEventListener("DOMContentLoaded", showTask);

inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

inputBox.addEventListener("focus", function () {
  document.querySelector(".row").classList.add("focused");
});

inputBox.addEventListener("blur", function () {
  document.querySelector(".row").classList.remove("focused");
});
