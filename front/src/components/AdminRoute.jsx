import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) return <Navigate to="/" replace />;

  const decoded = jwtDecode(token);
  const role = decoded?.role;

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;