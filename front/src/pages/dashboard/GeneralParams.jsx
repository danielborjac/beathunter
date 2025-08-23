import React, { useState, useEffect } from 'react';
import { getParamsByMode, updateParams } from '../../api/dashboard/params';
import { useSelector } from 'react-redux';
import './GeneralParams.css';

export default function GeneralParams() {
  const { token } = useSelector((state) => state.auth);
  const [mode, setMode] = useState('daily');
  const [form, setForm] = useState({
    id: null,
    mode: 'daily',
    total_songs: '',
    total_options: '',
    attempt_duration: '',
    fragment_1: '',
    fragment_2: '',
    fragment_3: ''
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos al cambiar modo
  useEffect(() => {
    if (!mode) return;
    loadParams(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  async function loadParams(selectedMode) {
    try {
      setLoading(true);
      const data = await getParamsByMode(selectedMode);
      const item = Array.isArray(data) ? data[0] : data;
      if (item) {
        setForm({
          id: item.id,
          mode: item.mode,
          total_songs: item.total_songs,
          total_options: item.total_options,
          attempt_duration: item.attempt_duration,
          fragment_1: item.fragment_1,
          fragment_2: item.fragment_2,
          fragment_3: item.fragment_3
        });
      }
    } catch (err) {
      console.error('Error cargando parámetros:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateParams(form.id, form, token);
      alert('Parámetros actualizados correctamente');
    } catch (err) {
      console.error('Error guardando parámetros:', err);
      alert('Error guardando parámetros');
    }
  }

  return (
    <div className="categories-page">
      <h2>Parámetros Generales</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Modo</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="daily">Diario</option>
            <option value="classic">Clásico</option>
            <option value="random">Aleatorio</option>
          </select>

          <label>Total de canciones por partida (máximo 12 canciones)</label>
          <input
            type="number"
            min="1"
            max="12"
            value={form.total_songs}
            onChange={(e) => setForm({ ...form, total_songs: e.target.value })}
          />

          <label>Total de opciones por canciones (máximo 12 opciones)</label>
          <input
            type="number"
            min="4"
            max="12"
            value={form.total_options}
            onChange={(e) => setForm({ ...form, total_options: e.target.value })}
          />

          <label>Duración de cada intento</label>
          <input
            type="number"
            min="3"
            value={form.attempt_duration}
            onChange={(e) => setForm({ ...form, attempt_duration: e.target.value })}
          />

          <label>Duración primer fragmento (máximo 10 segundos)</label>
          <input
            type="number"
            min="1" 
            max="10" 
            step="0.01"
            value={form.fragment_1}
            onChange={(e) => setForm({ ...form, fragment_1: e.target.value })}
          />

          <label>Duración segundo fragmento (máximo 10 segundos)</label>
          <input
            type="number"
            min="1" 
            max="10" 
            step="0.01"
            value={form.fragment_2}
            onChange={(e) => setForm({ ...form, fragment_2: e.target.value })}
          />

          <label>Duración tercer fragmento (máximo 10 segundos)</label>
          <input
            type="number"
            min="1"
            max="10"
            step="0.01"
            value={form.fragment_3}
            onChange={(e) => setForm({ ...form, fragment_3: e.target.value })}
          />

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}