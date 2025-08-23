import React, { useEffect, useState } from 'react';
import { getDailySongs, deleteDailySong } from '../../api/dashboard/dailySongs';
import SongsForm from '../../components/dashboard/dailySong/SongsForm';
import './CategoriesPage.css'; 
import { useSelector } from 'react-redux';


export default function DailySongsPage() {
  const [daily, setDaily] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);


  const { token } = useSelector(state => state.auth);

  async function load() {
    setLoading(true);
    try {
      const data = await getDailySongs(token);
      setDaily(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!window.confirm('Eliminar esta partida diaria?')) return;
    try {
      await deleteDailySong(id, token);
      load();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error eliminando');
    }
  }



  return (
    <div className="categories-page">
      <h2>Canciones Diarias</h2>

      <div className="form-container">
        <SongsForm
          editingData={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      </div>

      <div className="categories-list">
        <h2>Partidas del día</h2>
        {loading ? <p>Cargando...</p> : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Canciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {daily.length === 0 && <tr><td colSpan="3">No hay partidas</td></tr>}
                {daily.map(item => (
                  <tr key={item.id}>
                    <td data-label="Fecha">{item.date_release ?? item.date}</td>
                    <td data-label="Canciones">
                      {Array.isArray(item.songs) && item.songs.length > 0
                        ? item.songs.map(s => <div key={s.id}>{s.name} {s.artist ? `- ${s.artist}` : ''}</div>)
                        : Array.isArray(item.songs_id) && item.songs_id.length > 0
                          ? item.songs_id.join(', ')
                          : '—'
                      }
                    </td>
                    <td data-label="Acciones">
                      <button onClick={() => setEditing(item)}>Editar</button>
                      <button onClick={() => handleDelete(item.id)} style={{ marginLeft: 8, color: 'red' }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}