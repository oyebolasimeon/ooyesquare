import React from 'react';
import logoImage from '../assets/logo.png';
import './Logo.css';

const Logo = ({ onClick }) => {
  return (
    <div className="logo-container" onClick={onClick}>
      <div className="logo-image-wrapper">
        <img src={logoImage} alt="Oye(Yemi+Bola) Logo" className="logo-image" />
      </div>
    </div>
  );
};

export default Logo;

