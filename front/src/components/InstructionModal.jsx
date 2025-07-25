import './InstructionModal.css';

export default function InstructionModal({ mode, onClose, onStart }) {
  const messages = {
    normal: 'Adivina la canción correcta. Tienes 3 intentos y 6 opciones. Cada error reduce una opción.',
    daily: 'Modo diario: un intento al día. ¡Hazlo contar!',
    category: 'Adivina canciones de una categoría específica. ¡Demuestra tu conocimiento!'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Instrucciones</h2>
        <p>{messages[mode]}</p>
        <button onClick={onStart}>¡Comenzar!</button>
        <button className="close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}