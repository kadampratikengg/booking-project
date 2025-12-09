import { useState, useEffect } from "react";
import api from "../api/api";

export default function Rates() {
  const [rate, setRate] = useState("");

  useEffect(() => {
    async function getRate() {
      const res = await api.get("/admin/rates");
      setRate(res.data.rate);
    }
    getRate();
  }, []);

  const update = async () => {
    await api.post("/admin/rates", { rate });
    alert("Updated!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Update Base Fare Rate</h1>
      <input
        type="number"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <button onClick={update}>Save</button>
    </div>
  );
}
