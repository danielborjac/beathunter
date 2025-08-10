import { useState, useEffect } from 'react';
import './UsersForm.css';

export default function UsersForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '',
        password_hash: '', // en edición normalmente no se muestra hash
        role: initialData.role || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="users-form" onSubmit={handleSubmit}>
      <label>
        Username:
        <input name="username" value={formData.username} onChange={handleChange} required />
      </label>

      <label>
        Email:
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      </label>

      {!initialData && (
        <label>
          Password:
          <input name="password_hash" type="password" value={formData.password_hash} onChange={handleChange} required />
        </label>
      )}

      <label>
        Role:
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit">{initialData ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}