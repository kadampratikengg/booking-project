import { useEffect, useState } from "react";
import api from "../api/api";
import DataTable from "../components/DataTable";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    async function loadComplaints() {
      const res = await api.get("/admin/complaints");
      setComplaints(res.data);
    }
    loadComplaints();
  }, []);

  const columns = ["User", "Driver", "Message", "Date"];

  return (
    <div style={{ padding: 20 }}>
      <h1>Complaints</h1>
      <DataTable columns={columns} data={complaints} />
    </div>
  );
}
