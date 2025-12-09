import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/styles.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/admin-auth/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='center' style={styles.container}>
      <form className='card' style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>Admin Login</h2>

        <div className='form-row'>
          <input
            type='email'
            placeholder='Admin Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input'
            required
          />
        </div>

        <div className='form-row'>
          <input
            type='password'
            placeholder='Admin Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input'
            required
          />
        </div>

        <button
          className='button'
          type='submit'
          style={styles.buttonFull}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={styles.linksContainer}>
          <Link to='/register' className='link'>
            Create Account
          </Link>
          <span style={styles.separator}>•</span>
          <Link to='/forgot' className='link'>
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f6f8fb',
  },
  card: {
    width: '340px',
    padding: '32px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 6px 18px rgba(8, 15, 52, 0.06)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#1f2937',
  },
  buttonFull: {
    width: '100%',
    marginTop: '16px',
    marginBottom: '24px',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  separator: {
    color: '#d1d5db',
  },
};
