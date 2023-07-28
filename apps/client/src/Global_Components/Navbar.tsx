import React from 'react';
import Logo from './Logo';
import Button from './Buttons';
import NavLinks from './NavLinks';

const Navbar: React.FC = () => {
  return (
    <nav className="relative w-full h-24 z-50 mx-4 mt-2 rounded-tr-3xl rounded-bl-3xl bg-orange-200 flex items-center justify-between">
      <Logo />
      <div className="flex items-center space-x-4 pr-8">
        <div className="pr-16">
          <Button btnText='Sign In' />
        </div>
        <NavLinks isLoggedIn={false} />
      </div>
    </nav>
  );
};

export default Navbar;