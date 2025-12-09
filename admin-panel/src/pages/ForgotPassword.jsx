// admin-panel/src/pages/ForgotPassword.jsx
import { useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.post("/admin-auth/forgot-password", { email });
      setMsg("Password reset link sent to your email (check spam).");
    } catch (error) {
      setErr(error.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="container center">
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Forgot Password</h2>

        {err && <div className="alert error">{err}</div>}
        {msg && <div className="alert success">{msg}</div>}

        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" type="email" placeholder="Admin email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <button className="button" type="submit">Send Reset Link</button>
          </div>

          <div className="small"><Link to="/login" className="link">Back to login</Link></div>
        </form>
      </div>
    </div>
  );
}
