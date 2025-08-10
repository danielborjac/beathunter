import React from 'react';
import './SelectedItemList.css';

export default function SelectedItemList({ items, onRemove, itemKey, itemLabel }) {
  if (items.length === 0) return null;
  return (
    <div className="selected-item-list">
      <h4>Elementos seleccionados:</h4>
      <ul>
        {items.map(item => (
          <li key={item[itemKey]}>
            {item[itemLabel]}
            <button
              type="button"
              className="remove-btn"
              onClick={() => onRemove(item[itemKey])}
              title="Eliminar"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}