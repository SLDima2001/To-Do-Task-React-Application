import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5555/tasks");
      // Ensure we're setting the actual array of tasks
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault(); // Prevent form default submission
    if (!title.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      await axios.post("http://localhost:5555/tasks", { title, description });
      setTitle("");
      setDescription("");
      // Immediately fetch updated tasks
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
      setLoading(false);
    }
  };

  const markDone = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.put(`http://localhost:5555/tasks/${id}/done`);
      // Immediately fetch updated tasks
      await fetchTasks();
    } catch (error) {
      console.error("Error marking task as done:", error);
      setError("Failed to update task. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>To-Do List</h1>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={addTask} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
          rows={4}
          required
        ></textarea>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
      
      {loading && <p style={styles.loading}>Loading tasks...</p>}
      
      {!loading && tasks.length === 0 ? (
        <p style={styles.emptyMessage}>No tasks yet. Add one above!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task._id} style={styles.task}>
              <div style={styles.taskContent}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskDescription}>{task.description}</p>
                <p style={styles.taskDate}>
                  Created: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => markDone(task._id)} 
                style={styles.doneButton}
                disabled={loading}
              >
                Done
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "40px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none"
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    resize: "vertical",
    outline: "none"
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s"
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "transform 0.2s"
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    margin: "0 0 8px 0",
    color: "#333"
  },
  taskDescription: {
    margin: "0 0 10px 0",
    color: "#666",
    lineHeight: "1.4"
  },
  taskDate: {
    margin: 0,
    fontSize: "12px",
    color: "#999"
  },
  doneButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "15px",
    alignSelf: "center"
  },
  loading: {
    textAlign: "center",
    color: "#666"
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    margin: "30px 0"
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center"
  }
};

export default App;