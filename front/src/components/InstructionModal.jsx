import { useState } from 'react';
import './InstructionModal.css';

export default function InstructionModal({ mode, onClose, onStart }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const messages = {
    random: 'Tienes 3 intentos por canciones y cada error te permitirá escuchar un fragmento de mayor duración ¡Trata de adivinar las 6 canciones con la menor cantidad de errores!',
    daily: 'Tienes 3 intentos por canciones y cada error te permitirá escuchar un fragmento de mayor duración ¡Solo tendrás una oportunidad de adivinar 3 canciones por día!',
    classic: 'Tienes 3 intentos por canciones y cada error te permitirá escuchar un fragmento de mayor duración ¡Trata de adivinar las 6 canciones con la menor cantidad de errores!'
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
        <button className="close" onClick={onClose}>Atras</button>
      </div>
    </div>
  );
}