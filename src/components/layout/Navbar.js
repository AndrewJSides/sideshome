import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Updated styles below

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Home</span>
        </Link>

        {/* Hamburger icon for mobile */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation links */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/devices" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Devices
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;