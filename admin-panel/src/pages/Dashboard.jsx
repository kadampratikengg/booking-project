import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import '../styles/styles.css';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalRides: 0,
    pendingDocuments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/admin/stats');
        // controller returns { status: true, stats: { ... } }
        const data = res.data && res.data.stats ? res.data.stats : res.data;
        setStats(data || {});
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to load stats';
        toast.error(errorMsg);
        console.error('Stats error:', err.response || err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  function handleLogout() {
    localStorage.removeItem('adminToken');
    toast.success('Logged out');
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />

      <main style={{ flex: 1, padding: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h1>Dashboard</h1>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className='grid'>
            <div className='card'>
              <h4>Total Drivers</h4>
              <p style={{ fontSize: 28, fontWeight: 'bold' }}>
                {stats.totalDrivers || 0}
              </p>
            </div>

            <div className='card'>
              <h4>Total Rides</h4>
              <p style={{ fontSize: 28, fontWeight: 'bold' }}>
                {stats.totalRides || 0}
              </p>
            </div>

            <div className='card'>
              <h4>Pending Documents</h4>
              <p style={{ fontSize: 28, fontWeight: 'bold' }}>
                {stats.pendingDocuments || 0}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
