import React, { useState, useEffect } from 'react';
import { fetchGenres, createCategory, updateCategory } from '../../../api/dashboard/categories';
import { useSelector } from 'react-redux';
import './CategoryForm.css';

export default function GenreForm({ editingCategory, onCancel, onSaved }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        setError('Error cargando géneros: ' + err);
      }
    }
    loadGenres();
  }, []);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingCategory && editingCategory.mode === 'genre') {
      setSelectedGenreId(editingCategory.genre_id?.toString() || '');
      setName(editingCategory.name || '');
      setImage(editingCategory.image || '');
    } else {
      setSelectedGenreId('');
      setName('');
      setImage('');
    }
  }, [editingCategory]);

  function handleGenreChange(e) {
    const id = e.target.value;
    setSelectedGenreId(id);
    const selected = genres.find(g => g.id.toString() === id);
    if (selected) {
      setName(selected.name);
      setImage(selected.image);
    } else {
      setName('');
      setImage('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedGenreId) {
      setError('Debe seleccionar un género');
      return;
    }
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const data = {
      mode: 'genre',
      name,
      image,
      playlist_ids: null,
      genre_id: parseInt(selectedGenreId),
      artist_id: null,
    };

    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data, token);
      } else {
        await createCategory(data, token);
      }
      resetForm();
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSelectedGenreId('');
    setName('');
    setImage('');
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>{editingCategory ? 'Actualizar Género' : 'Añadir Género'}</h3>
      {error && <div className="error">{error}</div>}

      <label>Seleccionar Género</label>
      <select value={selectedGenreId} onChange={handleGenreChange}>
        <option value="">-- Seleccione --</option>
        {genres.map(g => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <label>Nombre (puede editar)</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre del género"
      />

      <label>URL de Imagen (opcional)</label>
      <input
        type="text"
        value={image}
        onChange={e => setImage(e.target.value)}
        placeholder="URL de imagen"
      />
    
      <button type="submit" disabled={loading}>
        {loading ? (editingCategory ? 'Actualizando...' : 'Creando...') : editingCategory ? 'Actualizar' : 'Añadir Género'}
      </button>
      {editingCategory && (
        <button type="button" onClick={handleCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}