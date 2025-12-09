// admin-panel/src/pages/Register.jsx
import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const onChange = (e) => setPayload({ ...payload, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/admin-auth/register", payload);
      setSuccessMsg("Account created. Please login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container center">
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <div className="header">
          <h1>Create Admin Account</h1>
        </div>

        {error && <div className="alert error">{error}</div>}
        {successMsg && <div className="alert success">{successMsg}</div>}

        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" name="name" placeholder="Full name" required onChange={onChange} />
          </div>

          <div className="form-row">
            <input className="input" type="email" name="email" placeholder="Email" required onChange={onChange} />
          </div>

          <div className="form-row">
            <input className="input" type="password" name="password" placeholder="Password" required onChange={onChange} />
          </div>

          <div className="form-row">
            <button className="button" type="submit">Create Account</button>
          </div>

          <div className="small">Already have an account? <Link to="/login" className="link">Login</Link></div>
        </form>
      </div>
    </div>
  );
}
