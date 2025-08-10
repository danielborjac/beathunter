import React, { useEffect, useState } from 'react';
import './SearchSelect.css';

/**
 * Props:
 * - searchTerm (optional): valor inicial del input
 * - onSearchChange (optional): (q) => void -> si el padre controla la búsqueda
 * - options (optional): [] -> si el padre te pasa resultados
 * - searchFunction (optional): async (q) => [] -> si quieres que este componente haga fetch
 * - onSelect: (item) => void
 * - optionKey, optionLabel, optionImage
 * - placeholder
 */
export default function SearchSelect({
  searchTerm = '',
  onSearchChange,
  options = [],
  searchFunction,
  onSelect,
  optionKey = 'id',
  optionLabel = 'name',
  optionImage = 'image',
  placeholder = 'Buscar...',
}) {
  const [query, setQuery] = useState(searchTerm || '');
  const [internalResults, setInternalResults] = useState([]);

  // Mantener sincronizado si padre controla `searchTerm`
  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  // Si se pasa searchFunction, hacemos búsqueda con debounce
  useEffect(() => {
    if (!searchFunction) return;

    if (!query || query.length < 2) {
      setInternalResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await searchFunction(query);
        setInternalResults(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('SearchSelect searchFunction error:', err);
        setInternalResults([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query, searchFunction]);

  // decidir qué resultados mostrar: si hay searchFunction -> internalResults, si no -> options (asegurarse de que sea array)
  const resultsToShow = searchFunction ? (internalResults || []) : (Array.isArray(options) ? options : []);

  function onInputChange(e) {
    const v = e.target.value;
    setQuery(v);
    if (onSearchChange) onSearchChange(v);
  }

  function handleSelect(item) {
    if (onSelect) onSelect(item);
    // limpiar búsqueda al seleccionar (comportamiento útil)
    setQuery('');
    if (onSearchChange) onSearchChange('');
    setInternalResults([]);
  }

  return (
    <div className="search-select">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={onInputChange}
        aria-label="search-input"
      />
      {resultsToShow && resultsToShow.length > 0 && (
        <ul className="options-list">
          {resultsToShow.map((item) => (
            <li
              key={item[optionKey] ?? JSON.stringify(item)}
              className="option-item"
              onClick={() => handleSelect(item)}
            >
              {optionImage && item[optionImage] && (
                <img src={item[optionImage]} alt={item[optionLabel]} className="option-image" />
              )}
              <span>{item[optionLabel] ?? item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}