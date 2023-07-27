import React from 'react';
import Logo from '../assets/Logo.svg';  // adjust path to your actual Logo path

const Navbar: React.FC = () => {
  return (
    <nav className="relative w-full z-50">
      <img src={Logo} alt="Logo" className="fixed top-0 left-0 h-auto w-full z-10 pr-4" />
    </nav>
  );
};

export default Navbar;
