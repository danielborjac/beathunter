import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../auth/authSlice';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();

  // Paso B: Accedemos al estado auth desde Redux
  const { user, token } = useSelector((state) => state.auth);

  // Paso C y 2: Mostramos el nombre y conectamos logout
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <h1>Beathunter</h1>

      {token ? (
        <div>
          <span style={{ marginRight: '1rem' }}>
            Bienvenido, <strong>{user?.username || 'Usuario'}</strong>
          </span>
          <button onClick={() => dispatch(logout())}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <Link to="/login" style={{ marginRight: '1rem' }}>Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;