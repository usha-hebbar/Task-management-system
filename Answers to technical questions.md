1.How long did you spend on the coding test? 
I spent approximately one day on the coding test. This includes designing the layout, implementing the functionality (task creation, editing, deletion, filtering, and search), and refining the user interface using HTML and CSS.

2.What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it?
The introduction of modern ES6+ features in JavaScript has greatly improved readability and ease of development. One of the most useful additions is the filter method, which allows efficient filtering of tasks based on criteria like priority or completion status.
Here’s an example snippet from the project:

javascript
// Filtering tasks by priority and completion status
const filterTasks = (priority, status) => {
  return tasks.filter(task => {
    const matchesPriority = priority === "All" || task.priority === priority;
    const matchesStatus = 
      status === "All" || 
      (status === "Completed" && task.completed) ||
      (status === "Pending" && !task.completed);
    return matchesPriority && matchesStatus;
  });
};
This concise implementation efficiently filters the task list, enhancing the user experience.

3.How would you track down a performance issue in production? Have you ever had to do this?
Monitor and Log: Use tools like browser dev tools, network monitoring, or application performance monitoring (e.g., New Relic, Datadog) to identify potential bottlenecks such as slow API calls or excessive DOM manipulation.
Profiling: If it’s a front-end issue, I’d use Chrome DevTools' Performance tab to analyze frame rate, rendering times, and JS execution times.
Analyze Logs: Review server and application logs to identify long-running queries or memory leaks.
Replicate the Issue: Try to reproduce the issue locally or in a staging environment with production-like data.
Optimize Code: Use techniques like code splitting, lazy loading, and efficient algorithms to address performance bottlenecks.

4.If you had more time, what additional features or improvements would you consider adding to the task management application?
User Authentication: Allow users to log in and save tasks specific to their account, using a backend service.
Real-Time Updates: Implement live syncing of tasks between devices using WebSockets or a library like Socket.IO.
Drag-and-Drop Interface: Enable users to reorder tasks or move them between different sections (e.g., upcoming, overdue, completed) with a drag-and-drop feature.
Progress Tracking: Add visual indicators, like a progress bar or charts, to track task completion rates.
Testing and Accessibility: Write unit tests for functionality and ensure WCAG-compliant accessibility standards for a better experience for all users.
These enhancements would make the application more feature-rich and suitable for broader use cases.

