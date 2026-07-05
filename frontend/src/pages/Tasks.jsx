import "./Tasks.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    assigned_to: "",
    due_date: ""
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/users");

      const onlyEmployees = response.data.filter(
        (emp) => emp.role === "employee"
      );

      setEmployees(onlyEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "pending",
      assigned_to: "",
      due_date: ""
    });

    setEditingTaskId(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/tasks/${editingTaskId}`, form);
      } else {
        await api.post("/tasks", form);
      }

      resetForm();
      setShowModal(false);
      fetchTasks();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setEditingTaskId(task.id);

    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      assigned_to: task.assigned_to,
      due_date: task.due_date
        ? task.due_date.substring(0, 10)
        : ""
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="tasks-container">

        <div className="tasks-header">

          <h1>Tasks</h1>

          {(user.role === "admin" || user.role === "manager") && (
            <button
              className="add-task-btn"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              + Add Task
            </button>
          )}

        </div>

        <div className="tasks-table-container">

          <table className="tasks-table">

            <thead>

              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Due Date</th>

                {(user.role === "admin" ||
                  user.role === "manager") && (
                  <th>Actions</th>
                )}

              </tr>

            </thead>

            <tbody>

              {tasks.length === 0 ? (

                <tr>
                  <td
                    colSpan={
                      user.role === "employee"
                        ? 5
                        : 6
                    }
                    className="no-data"
                  >
                    No tasks found.
                  </td>
                </tr>

              ) : (

                tasks.map((task) => (
                  <tr key={task.id}>

                    <td>{task.title}</td>

                    <td>{task.description}</td>

                    <td>{task.status}</td>

                    <td>{task.assigned_to}</td>

                    <td>{task.due_date}</td>

                    {(user.role === "admin" ||
                      user.role === "manager") && (

                      <td>
                                                <button
                          className="edit-btn"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </button>

                        {user.role === "admin" && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        )}

                      </td>

                    )}

                  </tr>
                ))

              )}

            </tbody>

          </table>

        </div>

        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <h2>
                {isEditing ? "Edit Task" : "Create Task"}
              </h2>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">
                    In Progress
                  </option>
                  <option value="done">
                    Done
                  </option>
                </select>

                <select
                  name="assigned_to"
                  value={form.assigned_to}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.full_name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  required
                />

                <div className="modal-actions">

                  <button type="submit">
                    {isEditing
                      ? "Update Task"
                      : "Create Task"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </>
  );
}

export default Tasks;