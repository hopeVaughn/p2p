import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Logo, HeadLogo } from '.';

interface NavItem {
  name: string;
  href: string;
}

const navigation: NavItem[] = [
  { name: 'Features', href: '#' },
  { name: 'FAQ', href: '#' },
  { name: 'Testimonials', href: '#' },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false); // Keep this state

  const isScrolledRef = useRef(isScrolled); // Also keep this ref

  useEffect(() => {
    const handleScroll = () => {
      const currentlyScrolled = window.scrollY > 0;
      if (currentlyScrolled !== isScrolledRef.current) {
        isScrolledRef.current = currentlyScrolled;
        setIsScrolled(currentlyScrolled); // Only update state if scroll status changed
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMobileMenuOpen = () => {
    setShowLogo(false);
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setShowLogo(true);
    setMobileMenuOpen(false);
  };

  const navClass = isScrolledRef.current ? 'backdrop-blur-md bg-white/30' : '';

  return (
    <header className={`sticky inset-x-0 top-0 z-50 ${navClass}`}>
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        {showLogo && (
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Logo />
            </a>
          </div>
        )}
        {!mobileMenuOpen && (
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-cyan-700"
              onClick={handleMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-cyan-900">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={handleMobileMenuClose}>
        <div className="fixed inset-0 z-50 " />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-aut px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <HeadLogo />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-cyan-700"
              onClick={handleMobileMenuClose}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-cyan-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-cyan-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <Link to="/login" className="text-sm font-semibold leading-6 text-cyan-900">
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}