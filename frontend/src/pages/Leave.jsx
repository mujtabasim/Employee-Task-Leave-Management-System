import "./Leave.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Leave() {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: ""
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leave");
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
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
      start_date: "",
      end_date: "",
      reason: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/leave", form);

      resetForm();
      setShowModal(false);
      fetchLeaves();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave request?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/leave/${id}`);
      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leave/${id}`, {
        status
      });

      fetchLeaves();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="leave-container">

        <div className="leave-header">

          <h1>Leave Requests</h1>

          {user.role === "employee" && (
            <button
              className="apply-btn"
              onClick={() => setShowModal(true)}
            >
              + Apply Leave
            </button>
          )}

        </div>

        <div className="leave-table-container">

          <table className="leave-table">

            <thead>

              <tr>

                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>

                {(user.role === "admin" ||
                  user.role === "manager" ||
                  user.role === "employee") && (
                  <th>Actions</th>
                )}

              </tr>

            </thead>

            <tbody>

              {leaves.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="no-data"
                  >
                    No leave requests found.
                  </td>

                </tr>

              ) : (

                leaves.map((leave) => (

                  <tr key={leave.id}>

                    <td>{leave.employee_id}</td>

                    <td>{leave.start_date}</td>

                    <td>{leave.end_date}</td>

                    <td>{leave.reason}</td>

                    <td>
                      <span
                        className={`status ${leave.status}`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td>
                                            {(user.role === "employee" &&
                        leave.status === "pending") && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(leave.id)}
                        >
                          Delete
                        </button>
                      )}

                      {(user.role === "admin" ||
                        user.role === "manager") && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              updateStatus(
                                leave.id,
                                "approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() =>
                              updateStatus(
                                leave.id,
                                "rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <h2>Apply Leave</h2>

              <form onSubmit={handleSubmit}>

                <label>Start Date</label>

                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />

                <label>End Date</label>

                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />

                <label>Reason</label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows="4"
                  required
                />

                <div className="modal-actions">

                  <button
                    type="submit"
                    className="apply-btn"
                  >
                    Apply
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

export default Leave;