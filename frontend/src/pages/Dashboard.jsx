import "./Dashboard.css";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    approvedLeaves: 0,
    employees: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/dashboard");

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">
          Employee Task & Leave Management System
        </h1>

        <div className="welcome-card">
          <h2>Welcome, {user?.full_name}</h2>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>

        <div className="dashboard-cards">
          <DashboardCard
            title="Total Tasks"
            value={stats.totalTasks}
          />

          <DashboardCard
            title="Pending Tasks"
            value={stats.pendingTasks}
          />

          <DashboardCard
            title="Approved Leaves"
            value={stats.approvedLeaves}
          />

          <DashboardCard
            title="Employees"
            value={stats.employees}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;