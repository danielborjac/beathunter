import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(register(formData)).then(res => {
      if (!res.error) navigate('/login');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <input name="username" placeholder="Nombre de usuario" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Correo" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit" disabled={loading}>Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}