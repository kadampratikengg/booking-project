// admin-panel/src/App.jsx (replace or merge)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Complaints from './pages/Complaints';
import Rates from './pages/Rates';
import AdminUsers from './pages/AdminUsers';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot' element={<ForgotPassword />} />
          <Route path='/reset' element={<ResetPassword />} />

          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/drivers'
            element={
              <ProtectedRoute>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path='/complaints'
            element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>
            }
          />
          <Route
            path='/rates'
            element={
              <ProtectedRoute>
                <Rates />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
