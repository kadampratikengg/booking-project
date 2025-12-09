// admin-panel/src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import api from "../api/api";
import { useSearchParams, Link } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!token) setErr("Invalid reset token");
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) return setErr("Passwords do not match");
    try {
      await api.post("/admin-auth/reset-password", { token, password });
      setMsg("Password reset successful. You can now login.");
    } catch (error) {
      setErr(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="container center">
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Reset Password</h2>

        {err && <div className="alert error">{err}</div>}
        {msg && <div className="alert success">{msg}</div>}

        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" type="password" placeholder="New password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-row">
            <input className="input" type="password" placeholder="Confirm password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <div className="form-row">
            <button className="button" type="submit">Set password</button>
          </div>

          <div className="small"><Link to="/login" className="link">Back to login</Link></div>
        </form>
      </div>
    </div>
  );
}
