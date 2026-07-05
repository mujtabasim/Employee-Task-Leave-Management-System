import "./Users.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Users() {

  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
    department_id: "",
    manager_id: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {

    try {

      const response = await api.get("/users");

      setUsers(response.data);

      setManagers(
        response.data.filter(
          (u) => u.role === "manager"
        )
      );

    } catch (error) {

      console.error(error);

    }

  };

  const fetchDepartments = async () => {

    try {

      const response = await api.get("/departments");

      setDepartments(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  const resetForm = () => {

    setEditingUser(null);

    setForm({

      full_name: "",
      email: "",
      password: "",
      role: "employee",
      department_id: "",
      manager_id: ""

    });

  };
    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingUser) {

        await api.put(`/users/${editingUser.id}`, {

          full_name: form.full_name,
          role: form.role,
          department_id: form.department_id || null,
          manager_id: form.manager_id || null

        });

        alert("User updated successfully.");

      } else {

        await api.post("/users", {

          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role,
          department_id: form.department_id || null,
          manager_id: form.manager_id || null

        });

        alert("User created successfully.");

      }

      fetchUsers();
      resetForm();
      setShowModal(false);

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );

    }

  };

  const handleEdit = (selectedUser) => {

    setEditingUser(selectedUser);

    setForm({

      full_name: selectedUser.full_name,
      email: selectedUser.email,
      password: "",
      role: selectedUser.role,
      department_id: selectedUser.department_id || "",
      manager_id: selectedUser.manager_id || ""

    });

    setShowModal(true);

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/users/${id}`);

      fetchUsers();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Delete failed."
      );

    }

  };

  return (

    <>

      <Navbar />

      <div className="users-container">

        <div className="users-header">

          <h1>Users</h1>

          {user.role === "admin" && (

            <button
              className="add-user-btn"
              onClick={() => {

                resetForm();

                setShowModal(true);

              }}
            >
              + Add User
            </button>

          )}

        </div>

        <div className="users-table-container">

          <table className="users-table">

            <thead>

              <tr>

                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Manager</th>

                {user.role === "admin" && (
                  <th>Actions</th>
                )}

              </tr>

            </thead>

            <tbody>
                            {users.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="no-data"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                users.map((item) => (

                  <tr key={item.id}>

                    <td>{item.full_name}</td>

                    <td>{item.email}</td>

                    <td>
                      <span className={`role-badge ${item.role}`}>
                        {item.role}
                      </span>
                    </td>

                    <td>

                      {
                        departments.find(
                          (d) => d.id === item.department_id
                        )?.name || "-"
                      }

                    </td>

                    <td>

                      {
                        managers.find(
                          (m) => m.id === item.manager_id
                        )?.full_name || "-"
                      }

                    </td>

                    {user.role === "admin" && (

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>

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

                {editingUser
                  ? "Edit User"
                  : "Create User"}

              </h2>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={editingUser}
                  required
                />

                {!editingUser && (

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />

                )}

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >

                  <option value="employee">
                    Employee
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>

                <select
                  name="department_id"
                  value={form.department_id}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (

                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>

                  ))}

                </select>

                <select
                  name="manager_id"
                  value={form.manager_id}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Manager
                  </option>

                  {managers.map((manager) => (

                    <option
                      key={manager.id}
                      value={manager.id}
                    >
                      {manager.full_name}
                    </option>

                  ))}

                </select>
                                <div className="modal-actions">

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    {editingUser ? "Update User" : "Create User"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
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

export default Users;