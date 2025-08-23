import React, { useEffect, useState } from 'react';
import SearchSelect from '../SearchSelect';
import SelectedItemList from '../SelectedItemList';
import { createDailySong, updateDailySong, searchSongs } from '../../../api/dashboard/dailySongs';
import { useSelector } from 'react-redux';
import '../categories/CategoryForm.css'; 
import { getParamsByMode } from '../../../api/dashboard/params';

export default function SongsForm({ editingData = null, onCancel, onSaved }) {
  const [date, setDate] = useState(''); // date_release
  const [selectedSongs, setSelectedSongs] = useState([]); // objetos {id, name, artist}
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  // Si entramos en edición, popular formulario
  useEffect(() => {
    
    if (editingData) {
      // backend puede devolver songs (detalladas) o songs_id (solo ids)
      setDate(editingData.date_release ?? editingData.date ?? '');
      if (Array.isArray(editingData.songs) && editingData.songs.length > 0) {
        setSelectedSongs(editingData.songs);
      } else if (Array.isArray(editingData.songs_id) && editingData.songs_id.length > 0) {
        // si solo hay ids, convertimos a objetos sencillos (nombre desconocido)
        setSelectedSongs(editingData.songs_id.map(id => ({ id })));
      } else {
        setSelectedSongs([]);
      }
    } else {
      setDate('');
      setSelectedSongs([]);
    }
  }, [editingData]);


  async function total_songs(){
    const songs = await getParamsByMode("daily");
    return songs[0].total_songs;   
  }

  async function handleAddSong(song) {
    const limit = await total_songs();
    console.log(limit);
    if (selectedSongs.find(s => s.id === song.id)) return;
    if (selectedSongs.length >= limit) {
      setError(`Solo puedes seleccionar ${limit} canciones.`);
      return;
    }
    setSelectedSongs(prev => [...prev, song]);
    setError('');
  }

  function handleRemoveSong(id) {
    setSelectedSongs(prev => prev.filter(s => s.id !== id));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const limit = await total_songs();
    console.log(limit);
    if (selectedSongs.length !== limit) {
      setError(`Debes seleccionar exactamente ${limit} canciones.`);
      return;
    }
    if (!date) {
      setError('Debes seleccionar una fecha.');
      return;
    }

    // Payload requerido: { songs_id: [...ids], date_release: 'YYYY-MM-DD' }
    const payload = {
      songs_id: selectedSongs.map(s => s.id),
      date_release: date,
    };

    setLoading(true);
    try {
      if (editingData && editingData.id) {
        await updateDailySong(editingData.id, payload, token);
      } else {
        await createDailySong(payload, token);
      }
      onSaved && onSaved();
      // limpiar
      setDate('');
      setSelectedSongs([]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error guardando partida diaria');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>{editingData ? 'Actualizar partida del día' : 'Añadir partida del día'}</h3>

      {error && <div className="error">{error}</div>}

      <label>Fecha</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <label>Buscar Canción</label>
      <SearchSelect
        searchFunction={searchSongs}          // SearchSelect hará la búsqueda internamente
        onSelect={handleAddSong}
        optionKey="id"
        optionLabel="name"
        optionImage={null}
        placeholder="Ej: canción, artista..."
      />

      <SelectedItemList
        items={selectedSongs}
        onRemove={handleRemoveSong}
        itemKey="id"
        itemLabel="name"
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading}>
          {loading ? (editingData ? 'Actualizando...' : 'Guardando...') : (editingData ? 'Actualizar' : 'Añadir partida del día')}
        </button>
        {editingData && (
          <button type="button" onClick={() => { setDate(''); setSelectedSongs([]); onCancel && onCancel(); }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}