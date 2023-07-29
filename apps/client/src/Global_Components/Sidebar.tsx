import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import Button from './Buttons';

// Define the props interface
interface SidebarProps {
  navigation: { name: string; href: string; }[];
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ navigation, setMobileMenuOpen, mobileMenuOpen }) => {
  return (
    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
      <div className="fixed inset-0 z-50" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 shadow-lg max-w-md px-2 sm:px-4 py-8 flex flex-col space-y-4 items-center mx-auto">
        <div className="flex items-center justify-between">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Societas</span>
            <Logo />
          </a>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-teal-900 hover:text-teal-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-10 w-10" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-xl font-regular leading-7 text-teal-900 hover:text-teal-600 flex justify-center items-center"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="py-6 flex justify-between items-center space-x-4">
              <Button btnText='Sign Up' />
              <Button btnText='Sign In' />
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Sidebar;
