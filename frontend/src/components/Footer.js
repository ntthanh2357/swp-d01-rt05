import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
        
          <div className="col-md-4 mb-4">
            <div className="footer-brand">
              <img 
                src="/images/logo.png" 
                alt="Heatwave Logo" 
                className="footer-logo"
              />
              <span className="brand-name">HEATWAVE</span>
            </div>
            <p className="footer-slogan">Empowering Your Future</p>
            <Link to="/about" className="footer-about-link">About Us</Link>
          </div>
         
          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">USEFUL LINKS</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="https://www.idp.com/vietnam/study-in-australia/top-universities-in-australia/" target="_blank" rel="noopener noreferrer">News & Events</a></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">KẾT NỐI VỚI CHÚNG TÔI</h5>
            <ul className="footer-contact">
              <li><i className="bi bi-envelope"></i> namdeptrai@heatwave.edu.vn</li>
              <li><i className="bi bi-telephone"></i> +84 935362685</li>
              <li><i className="bi bi-geo-alt"></i> FPT University, DaNang</li>
            </ul>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="bi bi-twitter"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

       
        <div className="row">
          <div className="col-12 text-center">
            <p className="footer-copyright">
              Bản quyền ©2025 Heatwave Education
            </p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}