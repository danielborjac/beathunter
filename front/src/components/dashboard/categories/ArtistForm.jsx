import React, { useState, useEffect } from 'react';
import SearchSelect from '../SearchSelect';
import { fetchArtists, createCategory, updateCategory } from '../../../api/dashboard/categories';
import { useSelector } from 'react-redux';
import './CategoryForm.css';

export default function ArtistForm({ editingCategory, onCancel, onSaved }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingCategory && editingCategory.mode === 'artist') {
      setSelectedArtist({ id: editingCategory.artist_id });
      setName(editingCategory.name || '');
      setImage(editingCategory.image || '');
    } else {
      setSelectedArtist(null);
      setName('');
      setImage('');
    }
  }, [editingCategory]);

  async function handleSearch(term) {
    setSearchTerm(term);
    if (term.length < 2) {
      setArtists([]);
      return;
    }
    try {
      const results = await fetchArtists(term);
      setArtists(results);
    } catch {
      setError('Error buscando artistas');
    }
  }

  function handleSelect(artist) {
    setSelectedArtist(artist);
    setName(artist.name);
    setImage(artist.image);
    setArtists([]);
    setSearchTerm('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedArtist) {
      setError('Debe seleccionar un artista');
      return;
    }
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const data = {
      mode: 'artist',
      name,
      image,
      playlist_ids: null,
      genre_id: null,
      artist_id: selectedArtist.id,
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
    setSelectedArtist('');
    setName('');
    setImage('');
  }

function handleCancel() {
  resetForm();
  onCancel();
}

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>{editingCategory ? 'Actualizar Artista' : 'Añadir Artista'}</h3>
      {error && <div className="error">{error}</div>}

      <label>Buscar Artista</label>
      <SearchSelect
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        options={artists}
        onSelect={handleSelect}
        optionKey="id"
        optionLabel="name"
        optionImage="image"
        placeholder="Buscar artistas..."
      />

      <label>Nombre (puede editar)</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre del artista"
      />

      <label>URL de Imagen (opcional)</label>
      <input
        type="text"
        value={image}
        onChange={e => setImage(e.target.value)}
        placeholder="URL de imagen"
      />

      <button type="submit" disabled={loading}>
        {loading ? (editingCategory ? 'Actualizando...' : 'Creando...') : editingCategory ? 'Actualizar' : 'Añadir Artista'}
      </button>
      {editingCategory && (
        <button type="button" onClick={handleCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}