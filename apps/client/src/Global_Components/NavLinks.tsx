import React from 'react';

interface NavLinksProps {
  isLoggedIn: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ isLoggedIn }) => {
  const links = isLoggedIn
    ? ['Search', 'Add', 'Profile']
    : ['Home', 'About', 'F.A.Q', 'Contact'];

  return (
    <div className="justify-between items-center gap-8 inline-flex">
      {links.map((link) => (
        <div
          key={link}
          className="text-xl font-light text-teal-900 cursor-pointer"
        >
          {link}
        </div>
      ))}
    </div>
  );
};

export default NavLinks;