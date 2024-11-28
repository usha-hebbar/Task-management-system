let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTaskId = null;

document.getElementById("task-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (editingTaskId) {
   
    const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
    tasks[taskIndex] = {
      id: editingTaskId,
      title,
      description,
      dueDate,
      priority,
      status: tasks[taskIndex].status,  
    };
    editingTaskId = null;
  } else {
    const task = {
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      status: "pending",
    };
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateDashboard();
  e.target.reset();
});


document.getElementById("search").addEventListener("input", () => {
  updateDashboard();
});

document.getElementById("filter-priority").addEventListener("change", () => {
  updateDashboard();
});

document.getElementById("filter-status").addEventListener("change", () => {
  updateDashboard();
});

// Function to update dashboard based on filters and search
function updateDashboard() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const selectedPriority = document.getElementById("filter-priority").value;
  const selectedStatus = document.getElementById("filter-status").value;
  const now = new Date().toISOString().split("T")[0]; // Get the current date (yyyy-mm-dd)

  const upcoming = document.getElementById("upcoming-list");
  const overdue = document.getElementById("overdue-list");
  const completed = document.getElementById("completed-list");

  upcoming.innerHTML = "";
  overdue.innerHTML = "";
  completed.innerHTML = "";

  // Arrays to keep track of the tasks in each category
  let upcomingTasks = [];
  let overdueTasks = [];
  let completedTasks = [];

  tasks
    .filter((task) => {
      // Filter tasks based on search query, priority, and status
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery);
      const matchesPriority =
        !selectedPriority || task.priority === selectedPriority;
      const matchesStatus =
        !selectedStatus || task.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    })
    .forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="taskdata">
          <strong>${task.title}</strong>
          <span class="priority ${task.priority}">${task.priority}</span>
          <p>${task.description}</p>
          <small>Due: ${task.dueDate}</small>
        </div>
        <button class="complete" onclick="deleteTask(${task.id})">Delete</button>
        <button class="complete" id="complete" onclick="editTask(${task.id})">Edit</button>
      `;

      // Add a "Complete" button only for pending tasks (not completed)
      if (task.status !== "completed") {
        li.innerHTML = `
          <div>
            <strong>${task.title}</strong>
            <span class="priority ${task.priority}">${task.priority}</span>
            <p>${task.description}</p>
            <small>Due: ${task.dueDate}</small>
          </div>
          <button class="complete" onclick="markComplete(${task.id})">Complete</button>
          <button class="complete1" onclick="deleteTask(${task.id})">Delete</button>
          <button class="complete2" id="complete" onclick="editTask(${task.id})">Edit</button>
        `;
      }

      // Categorize tasks into upcoming, overdue, or completed
      if (task.status === "completed") {
        completedTasks.push(li);
      } else if (task.dueDate < now) {
        overdueTasks.push(li);
      } else {
        upcomingTasks.push(li);
      }
    });

  // Display the Upcoming section only if there are upcoming tasks
  if (upcomingTasks.length > 0) {
    const upcomingSection = document.createElement('div');
    upcomingSection.innerHTML = '<h4><u>Upcoming Tasks</u></h4>';
    upcomingTasks.forEach(task => upcomingSection.appendChild(task));
    upcoming.appendChild(upcomingSection);
  }

  // Display the Overdue section only if there are overdue tasks
  if (overdueTasks.length > 0) {
    const overdueSection = document.createElement('div');
    overdueSection.innerHTML = '<h4><u>Overdue Tasks</u></h4>';
    overdueTasks.forEach(task => overdueSection.appendChild(task));
    overdue.appendChild(overdueSection);
  }

  // Display the Completed section only if there are completed tasks
  if (completedTasks.length > 0) {
    const completedSection = document.createElement('div');
    completedSection.innerHTML = '<h4><u>Completed Tasks</u></h4>';
    completedTasks.forEach(task => completedSection.appendChild(task));
    completed.appendChild(completedSection);
  }
}



function markComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = "completed";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateDashboard();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateDashboard();
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("due-date").value = task.dueDate;
    document.getElementById("priority").value = task.priority;

    editingTaskId = id;  // Store the ID of the task being edited
    document.getElementById("task-form").scrollIntoView({
      behavior: "smooth"
    });
    
  }
}
const renderTasks = () => {
  taskList.innerHTML = '';
  
  const now = new Date();
  const filteredTasks = tasks.filter((task) => {
      const matchesPriority = priorityFilter.value === 'All' || task.priority === priorityFilter.value;
      const matchesStatus = 
          statusFilter.value === 'All' ||
          (statusFilter.value === 'Completed' && task.completed) ||
          (statusFilter.value === 'Pending' && !task.completed);

      const searchTerm = searchInput.value.toLowerCase();
      const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                            task.description.toLowerCase().includes(searchTerm);

      return matchesPriority && matchesStatus && matchesSearch;
  });

  // Filter upcoming tasks (tasks with a future due date and not completed)
  const upcomingTasks = filteredTasks.filter(task => new Date(task.dueDate) > now && !task.completed);

  // Render upcoming tasks separately
  if (upcomingTasks.length > 0) {
      const upcomingSection = document.createElement('div');
      upcomingSection.innerHTML = '<h4>Upcoming Tasks</h4>';
      upcomingTasks.forEach((task) => {
          const taskItem = document.createElement('li');
          taskItem.className = `task-item list-group-item ${task.completed ? 'completed' : ''}`;
          taskItem.innerHTML = `
              <div class="taskdata">
                  <h5>${task.title}</h5>
                  <p>${task.description}</p>
                  <small>Due: ${task.dueDate} | Priority: ${task.priority}</small>
              </div>
              <div>
                  <button class="btn btn-success btn-sm" onclick="toggleTaskCompletion(${task.id})">
                      ${task.completed ? 'Mark Pending' : 'Mark Completed'}
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
              </div>
          `;
          upcomingSection.appendChild(taskItem);
      });
      taskList.appendChild(upcomingSection);
  }

  // Render other tasks
  filteredTasks.forEach((task) => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item list-group-item ${task.completed ? 'completed' : ''}`;
      taskItem.innerHTML = `
          <div class="taskdata">
              <h5>${task.title}</h5>
              <p>${task.description}</p>
              <small>Due: ${task.dueDate} | Priority: ${task.priority}</small>
          </div>
          <div>
              <button class="btn btn-success btn-sm" onclick="toggleTaskCompletion(${task.id})">
                  ${task.completed ? 'Mark Pending' : 'Mark Completed'}
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
          </div>
      `;
      taskList.appendChild(taskItem);
  });
};

updateDashboard();
