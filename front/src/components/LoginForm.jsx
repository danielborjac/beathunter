import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function LoginForm({ onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login(formData)).then(res => {
      if (!res.error) {
        onSuccess?.(); // Cierra modal
        navigate('/');
      }
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        name="email"
        placeholder="Correo"
        onChange={handleChange}
        value={formData.email}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
        value={formData.password}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}