import { useState } from 'react';
import './InstructionModal.css';

export default function InstructionModal({ mode, onClose, onStart }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const messages = {
    normal: 'Adivina la canción correcta. Tienes 3 intentos y 6 opciones. Cada error reduce una opción.',
    daily: 'Modo diario: un intento al día. ¡Hazlo contar!',
    category: 'Adivina canciones de una categoría específica. ¡Demuestra tu conocimiento!'
  };

  const handleStart = () => {
    if (dontShowAgain) {
      const hiddenModes = JSON.parse(localStorage.getItem('hideInstructions') || '{}');
      hiddenModes[mode] = true;
      localStorage.setItem('hideInstructions', JSON.stringify(hiddenModes));
    }
    onStart();
  };

  return (
    <div className="modal-overlay-i">
      <div className="modal-content">
        <h2>Instrucciones</h2>
        <p>{messages[mode]}</p>

        <label style={{ display: 'block', marginTop: '1em' }}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          {' '}
          No volver a mostrar
        </label>

        <button onClick={handleStart}>¡Comenzar!</button>
        <button className="close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}