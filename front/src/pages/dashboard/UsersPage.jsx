import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, searchUsers } from '../../api/dashboard/users';
import SearchSelect from '../../components/dashboard/SearchSelect';
import { useSelector } from 'react-redux';
import './UsersPage.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userSearch: '', email: '', role: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);
  const { token } = useSelector((state) => state.auth);

  // carga inicial de todos los usuarios
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers(token);
      // aceptar varias formas de respuesta
      const list = Array.isArray(data) ? data : (data.users || data.user || []);
      setUsers(list);
    } catch (err) {
      console.error(err);
    }
  }

  // Debounce: cuando cambia searchQuery hacemos la búsqueda (o recargamos todo si vacío)
  useEffect(() => {
    const t = setTimeout(async () => {
      // si está vacío -> recargar todos
      if (!searchQuery || searchQuery.trim().length === 0) {
        setSearchOptions([]);
        await loadUsers();
        return;
      }

      try {
        const res = await searchUsers(searchQuery.trim(), token);
        const list = Array.isArray(res) ? res : (res.users || res.user || []);
        setSearchOptions(list);
        setUsers(list); // sustituir tabla por resultados
      } catch (err) {
        console.error('Error buscando usuarios:', err);
        setSearchOptions([]);
        // no hacemos fallback automático a loadUsers para no confundir al usuario
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(t);
  }, [searchQuery, token]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, {
          username: form.userSearch,
          email: form.email,
          role: form.role,
          password: form.password || undefined
        }, token);
      } else {
        // Si quieres crear, implementa createUser similar a updateUser (ahora no estaba en tu snippet)
        // await createUser({ username: form.userSearch, email: form.email, role: form.role, password: form.password }, token);
      }

      // limpiar formulario y recargar
      setForm({ userSearch: '', email: '', role: '', password: '' });
      setEditingId(null);
      setShowForm(false);
      setSearchQuery(''); // limpiar search para que tabla vuelva a lista completa
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(user) {
    setForm({
      userSearch: user.username,
      email: user.email,
      role: user.role,
      password: ''
    });
    setEditingId(user.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await deleteUser(id, token);
      // si borramos el usuario que estamos editando, cerrar el form
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        setForm({ userSearch: '', email: '', role: '', password: '' });
      }
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="categories-page">
      <h2>Gestión de Usuarios</h2>

      {/* SearchSelect siempre visible y fuera del formulario */}
      <div style={{ maxWidth: 450, margin: '0 auto 18px' }}>
        <SearchSelect
          searchTerm={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          options={searchOptions}
          optionKey="id"
          optionLabel="username"
          onSelect={(user) => {
            // al seleccionar del dropdown rellenamos inputs pero no abrimos el form
            setForm((prev) => ({ ...prev, userSearch: user.username, email: user.email }));
            // también actualizar la tabla para que solo muestre el usuario seleccionado (opcional)
            setUsers([user]);
          }}
          placeholder="Buscar usuario por username..."
        />
      </div>

      {/* Formulario de editar/crear — oculto hasta pulsar Editar */}
      {showForm && (
        <div className="form-container">
          <div className="users-form">
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={form.userSearch}
                onChange={(e) => setForm({ ...form, userSearch: e.target.value })}
              />

              <label>Correo</label>
              <input
                type="email"
                placeholder="Correo"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <label>Rol</label>
              <input
                type="text"
                placeholder="Rol"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />

              <label>Contraseña (opcional)</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ userSearch: '', email: '', role: '', password: '' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="categories-list">
        <h2>Lista de Usuarios</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button onClick={() => handleEdit(u)}>Editar</button>
                      <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 8, color: 'red' }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No se encontraron usuarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}