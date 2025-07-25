import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <p>© {new Date().getFullYear()} Beathunter - Todos los derechos reservados</p>
      <div className="footer-links">
        <a href="#">Política de Privacidad</a>
        <a href="#">Términos de Uso</a>
        <a href="#">Redes Sociales</a>
      </div>
    </footer>
  );
}