import { useEffect, useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CustomerSupport',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data && res.data.users) setUsers(res.data.users);
    } catch (err) {
      console.error('Load admin users error', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to load admin users');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', form);
      toast.success('Admin user created');
      setForm({ name: '', email: '', password: '', role: 'CustomerSupport' });
      loadUsers();
    } catch (err) {
      console.error('Create admin error', err.response || err);
      toast.error(err.response?.data?.message || 'Create failed');
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>Admin Users</h1>
        </div>

        <section style={{ marginTop: 18 }}>
          <form
            className='card'
            onSubmit={handleCreate}
            style={{ maxWidth: 560 }}
          >
            <h3>Create Admin User</h3>
            <div className='form-row'>
              <input
                placeholder='Name'
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className='input'
              />
            </div>
            <div className='form-row'>
              <input
                placeholder='Email'
                value={form.email}
                type='email'
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className='input'
              />
            </div>
            <div className='form-row'>
              <input
                placeholder='Password'
                value={form.password}
                type='password'
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className='input'
              />
            </div>
            <div className='form-row'>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className='input'
              >
                <option>SuperAdmin</option>
                <option>DriverApprover</option>
                <option>CustomerSupport</option>
                <option>Accounts</option>
              </select>
            </div>

            <button className='button' type='submit'>
              Create
            </button>
          </form>
        </section>

        <section style={{ marginTop: 24 }}>
          <h3>Existing Admin Users</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className='grid'>
              {users.map((u) => (
                <div key={u._id} className='card'>
                  <strong>{u.name}</strong>
                  <div>{u.email}</div>
                  <div style={{ marginTop: 8 }}>{u.role}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
