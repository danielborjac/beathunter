import React, { useState, useEffect } from 'react';
import SearchSelect from '../SearchSelect';
import SelectedItemList from '../SelectedItemList';
import { fetchPlaylists, createCategory, updateCategory } from '../../../api/dashboard/categories';
import { useSelector } from 'react-redux';
import './CategoryForm.css';

export default function MixForm({ editingCategory = null, onCancel, onSaved }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Popular form en modo edición
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setImage(editingCategory.image || '');
      if (Array.isArray(editingCategory.playlists_info) && editingCategory.playlists_info.length > 0) {
        // usamos la info completa de playlists
        setSelectedPlaylists(editingCategory.playlists_info);
      } else if (Array.isArray(editingCategory.playlist_ids)) {
        // fallback si solo hay ids
        setSelectedPlaylists(editingCategory.playlist_ids.map(id => ({ id, name: `Playlist ${id}`, image: '' })));
      } else {
        setSelectedPlaylists([]);
      }
    } else {
      resetForm();
    }
  }, [editingCategory]);

  function resetForm() {
    setName('');
    setImage('');
    setSearchTerm('');
    setResults([]);
    setSelectedPlaylists([]);
    setError('');
  }

  // Búsqueda con debounce
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await fetchPlaylists(searchTerm);
        setResults(r);
      } catch (e) {
        setError('Error buscando playlists' + e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Añadir playlist
  function addPlaylist(pl) {
    if (!selectedPlaylists.find(p => p.id === pl.id)) {
      if (selectedPlaylists.length === 0 && (!image || image.trim() === '')) {
        setImage(pl.image || '');
      }
      setSelectedPlaylists(prev => [...prev, pl]);
    }
    setSearchTerm('');
    setResults([]);
  }

  function removePlaylist(id) {
    setSelectedPlaylists(prev => prev.filter(p => p.id !== id));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (selectedPlaylists.length < 5) {
      setError('Debe seleccionar al menos 5 playlists.');
      return;
    }

    const payload = {
      name,
      mode: 'mix',
      image: image || selectedPlaylists[0]?.image || '',
      playlist_ids: selectedPlaylists.map(p => p.id),
      playlists_info: selectedPlaylists.map(p => ({
        id: p.id,
        name: p.name,
        image: p.image || ''
      })),
      genre_id: null,
      artist_id: null,
    };

    setLoading(true);
    try {
      if (editingCategory && editingCategory.id) {
        await updateCategory(editingCategory.id, payload, token);
      } else {
        await createCategory(payload, token);
      }
      onSaved && onSaved();
      resetForm();
    } catch (e) {
      console.error(e);
      setError(e.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>{editingCategory ? 'Editar Mix' : 'Crear Mix'}</h3>
      {error && <div className="error">{error}</div>}

      <label>Nombre</label>
      <input value={name} onChange={e=>setName(e.target.value)} />

      <label>URL imagen</label>
      <input value={image} onChange={e=>setImage(e.target.value)} placeholder="(opcional)" />

      <label>Buscar playlist</label>
      <SearchSelect
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        options={results}
        onSelect={addPlaylist}
        optionKey="id"
        optionLabel="name"
        optionImage="image"
      />

      <SelectedItemList
        items={selectedPlaylists}
        onRemove={removePlaylist}
        itemKey="id"
        itemLabel="name"
      />

      <div style={{ display: 'flex', gap: 8}}>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Añadir mix')}
        </button>
        {editingCategory && (
          <button type="button" onClick={() => { resetForm(); onCancel && onCancel(); }}>
            Cancelar
          </button>
        )}
      </div>  
    </form>
  );
}