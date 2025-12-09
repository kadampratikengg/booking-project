import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ drivers: 0, rides: 0, complaints: 0 });

  useEffect(() => {
    async function loadStats() {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    }
    loadStats();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="card">Total Drivers: {stats.drivers}</div>
        <div className="card">Total Rides: {stats.rides}</div>
        <div className="card">Complaints: {stats.complaints}</div>
      </div>
    </div>
  );
}
