import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Logo from '../Global_Components/Logo';
import Button from '../Global_Components/Buttons';

interface NavigationItem {
  name: string
  href: string
}

interface NavbarProps {
  navigation: NavigationItem[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrolled: boolean;
  navbarHeight: number;
}

const Navbar: React.FC<NavbarProps> = ({ navigation, mobileMenuOpen, setMobileMenuOpen, scrolled, navbarHeight }) => {
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    event.preventDefault();
    const targetElement = document.querySelector(href);
    const elementPosition = targetElement?.getBoundingClientRect().top || 0;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };
  return (
    <nav className={`flex mx-auto items-center justify-between p-6 mr-0 lg:px-8 ${scrolled && !mobileMenuOpen ? 'bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 shadow-lg' : ''}`} aria-label="Global">
      <div className="flex lg:flex-1">
        {!mobileMenuOpen && (
          <a href="#" className="-m-1.5 p-1.5 mr-auto">
            <span className="sr-only">Societas</span>
            <Logo />
          </a>
        )}
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-teal-900 hover:text-teal-700"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-10 w-10" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-xl font-regular leading-6 text-teal-900 hover:text-teal-500"
            onClick={(e) => handleNavClick(e, item.href)}
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="flex justify-between items-center space-x-4">
          <Button btnText='Sign Up' />
          <Button btnText='Sign In' />
        </div>
      </div>
    </nav>
  )

}

export default Navbar
