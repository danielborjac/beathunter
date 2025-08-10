import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './categoriesPage.css';
import { fetchCategories } from '../api/categories'; 
import FullScreenLoader from '../components/FullScreenLoader';
import { BiSolidSearch } from "react-icons/bi";
import LoginForm from '../components/LoginForm';
import Modal from '../components/modal';
import { useSelector } from 'react-redux';

const CategoryRow = ({ title, items, type, limit = 6 }) => {

  const { token } = useSelector(state => state.auth);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(limit);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //const visibleItems = items.slice(0, visibleCount);
  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleClick = (item) => {
    if(!token) setShowLogin(true);
    else{
      const data =
        type === 'mix'
          ? { mode: "classic", type: 'mix', playlists: item.playlist_ids, limit: 6 }
          : type === 'genre'
          ? { mode: "classic", type: 'genre', genreId: item.genre_id, limit: 6 }
          : { mode: "classic", type: 'artist', artistId: item.artist_id, limit: 6 };
      navigate('/game', { state: data });
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + limit);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
        setSearchTerm("");
        setIsSearching(false);
        //setVisibleCount(limit);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [limit]);

  return (
    <div className="category-row">
      <div className="category-header">
        <h2 className="category-title">{title}</h2>
        <div className="search-container" ref={searchRef}>
          {!isSearching ? (
            <BiSolidSearch className="search-icon" onClick={() => setIsSearching(true)} />
          ) : (
            <input
              type="text"
              className={`category-search expanded`}
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                // Solo reinicia si hay una búsqueda activa
                if (value.trim() !== "") {
                  setVisibleCount(limit);
                }
              }}
              autoFocus
            />
          )}
        </div>
      </div>

      <div className="category-grid">
        {visibleItems.map((item) => (
          <div key={item.id} onClick={() => handleClick(item)} className="category-item fade-in">
            <img src={item.image} alt={item.name} loading="lazy" />
            <div className="category-name">{item.name}</div>
          </div>
        ))}
      </div>

      {visibleCount < filteredItems.length && (
        <div className="load-more-wrapper">
          <button className="category-toggle" onClick={handleLoadMore}>
            Ver más
          </button>
        </div>
      )}

      {showLogin && (
      <Modal show={showLogin} onClose={() => setShowLogin(false)}>
          <LoginForm onSuccess={() => setShowLogin(false)} />
      </Modal>
      )}

    </div>
  );
};

const CategoriesPage = () => {

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({ genres: [], mixes: [], artists: [] });

  useEffect(() => {
    setLoading(true)
    const loadCategories = async () => {
      try {
        const data = await fetchCategories("all");
        setCategories(data);
      } catch(error){
        console.error(error);
      } finally {
        setLoading(false);
      }

    };

    loadCategories();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="classic-container">
      <div className="categories-container">
        <CategoryRow title="Mixes personalizados" items={categories.mixes} type="mix" />
        <CategoryRow title="Géneros" items={categories.genres} type="genre" />
        <CategoryRow title="Artistas y Grupos" items={categories.artists} type="artist" />
      </div>
    </div>
  );
};

export default CategoriesPage;