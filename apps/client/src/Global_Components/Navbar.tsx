import React from 'react';
import Banner from '../assets/Icons/Banner.svg';
import Logo_Main from '../assets/Icons/Logo_Main.svg';

const Navbar: React.FC = () => {
  return (
    <nav className="relative w-full h-16 z-50">
      <img src={Banner} alt="Banner" className="absolute top-0 left-0 h-16 w-full z-10" />

      <div className="absolute top-0 flex items-center justify-start h-full w-full z-20 px-6">
        <img src={Logo_Main} alt="Logo" style={{ position: 'fixed', width: '25vw', height: '15vw', left: '1vw' }} />
      </div>
    </nav>
  );
};

export default Navbar;
