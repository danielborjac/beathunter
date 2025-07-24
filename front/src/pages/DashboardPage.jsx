import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.username || user?.email} 🎮</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default DashboardPage;