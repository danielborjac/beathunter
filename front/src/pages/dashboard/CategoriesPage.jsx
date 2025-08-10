import React, { useState, useEffect } from 'react';
import './CategoriesPage.css';

import MixForm from '../../components/dashboard/categories/MixForm';
import GenreForm from '../../components/dashboard/categories/GenreForm';
import ArtistForm from '../../components/dashboard/categories/ArtistForm';
import { fetchCategories, deleteCategory } from '../../api/dashboard/categories';
import { useSelector } from 'react-redux';


export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('mix');
  const [categories, setCategories] = useState([]);
  //const [reloadFlag, setReloadFlag] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  

  /*useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        console.log(data);
        setCategories(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [reloadFlag]);*/

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await fetchCategories(); // recuerda que fetchCategories devuelve array combinado
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCategories(); }, []);


  // -------------- EDIT --------------
  const handleEdit = (cat) => {
    // selecciona la pestaña correspondiente
    setActiveTab(cat.mode === 'genre' ? 'genre' : cat.mode === 'artist' ? 'artist' : 'mix');
    setEditingCategory(cat);
    // scroll-to-form opcionalsi quieres: document.querySelector('.form-container')?.scrollIntoView({behavior:'smooth'});
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };


  // -------------- DELETE --------------
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    try {
      await deleteCategory(id, token);
      // Mantener UI reactiva: eliminar localmente sin recargar
      setCategories(prev => prev.filter(c => c.id !== id));
      if (editingCategory?.id === id) handleCancelEdit();
    } catch (e) {
      console.error('Error eliminando categoría', e);
      alert('Error eliminando categoría');
    }
  };


  /*function onCreated() {
    setReloadFlag(!reloadFlag);
  }*/

  const filteredCategories = categories.filter(cat => cat.mode === activeTab);

  return (
    <div className="categories-page">
      <h1>Gestión de Categorías</h1>
      <div className="tabs">
        <button
          className={activeTab === 'mix' ? 'active' : ''}
          onClick={() => setActiveTab('mix')}
        >
          Mixes
        </button>
        <button
          className={activeTab === 'genre' ? 'active' : ''}
          onClick={() => setActiveTab('genre')}
        >
          Géneros
        </button>
        <button
          className={activeTab === 'artist' ? 'active' : ''}
          onClick={() => setActiveTab('artist')}
        >
          Artistas
        </button>
      </div>

      {/*<div className="form-container">
        {activeTab === 'mix' && <MixForm onCreated={onCreated} />}
        {activeTab === 'genre' && <GenreForm onCreated={onCreated} />}
        {activeTab === 'artist' && <ArtistForm onCreated={onCreated} />}
      </div>*/}

      <div className="form-container">
        {activeTab === 'mix' && (
          <MixForm
            editingCategory={editingCategory && editingCategory.mode === 'mix' ? editingCategory : null}
            onCancel={handleCancelEdit}
            onSaved={loadCategories}
          />
        )}
        {activeTab === 'genre' && (
          <GenreForm
            editingCategory={editingCategory && editingCategory.mode === 'genre' ? editingCategory : null}
            onCancel={handleCancelEdit}
            onSaved={loadCategories}
          />
        )}
        {activeTab === 'artist' && (
          <ArtistForm
            editingCategory={editingCategory && editingCategory.mode === 'artist' ? editingCategory : null}
            onCancel={handleCancelEdit}
            onSaved={loadCategories}
          />
        )}
      </div>
    
      <div className="table-responsive">  
        <div className="categories-list">
          <h2>Categorías Existentes</h2>
          {loading ? <p>Cargando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Modo</th>
                <th>Imagen</th>
                {/* <th>Playlist IDs</th>
                <th>Genre ID</th>
                <th>Artist ID</th>*/}
                <th>Creado</th>
                <th>Actualizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan="8">No hay categorías</td></tr>
              )}
              {filteredCategories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.mode}</td>
                  <td>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="cat-image" />
                    ) : (
                      '—'
                    )}
                  </td>
                  {/*<td>{cat.playlist_ids ? cat.playlist_ids.join(', ') : '—'}</td>
                  <td>{cat.genre_id ?? '—'}</td>
                  <td>{cat.artist_id ?? '—'}</td>*/}
                  <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(cat.updatedAt).toLocaleDateString()}</td>
                  <td>
                      <button onClick={() => handleEdit(cat)}>Editar</button>
                      <button onClick={() => handleDelete(cat.id)} style={{marginLeft:8,color:'red'}}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}