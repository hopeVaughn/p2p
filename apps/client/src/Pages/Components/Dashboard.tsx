import { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { MapComponent, HeadLogo } from '.';
import { decodeAccessToken } from '../../utils/helpers';
import { useLogout } from '../../utils/hooks';
import { useNavigate } from 'react-router-dom';

type DashboardProps = {
  children: React.ReactNode;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard({ children }: DashboardProps) {
  const [navigation, setNavigation] = useState([
    { name: 'Search', current: true },
    { name: 'Add Bathroom', current: false },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAddBathroomMode, setIsAddBathroomMode] = useState(false);

  const { logout } = useLogout();
  const navigate = useNavigate();
  const userInfo = decodeAccessToken();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await logout();
    navigate('/');
  };

  const handleNavigationClick = (clickedItemName: string) => {
    setNavigation(prevNav =>
      prevNav.map(item => ({
        ...item,
        current: item.name === clickedItemName
      }))
    );
    // Set the isAddBathroomMode state based on the clicked item name
    setIsAddBathroomMode(clickedItemName === 'Add Bathroom');
  };

  const user = {
    email: userInfo?.email
  };

  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', action: handleLogout },
  ];

  return (
    <Fragment>
      {/* main container */}
      <div className="min-h-full">

        {/* navbar */}
        <Disclosure as="nav" className="bg-cyan-600">
          {({ open }) => (
            <Fragment>

              {/* Top Bar */}
              <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                  {/* Logo & Primary Nav */}
                  <section className="flex items-center">
                    <div className="flex-shrink-0">

                      {/* Logo */}
                      <HeadLogo size={10} />
                    </div>

                    {/* Primary Navigation for Desktop */}
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            onClick={() => handleNavigationClick(item.name)}
                            className={classNames(
                              item.current
                                ? 'bg-cyan-700 text-white'
                                : 'text-white hover:bg-cyan-500 hover:bg-opacity-75',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </section>
                  {/* Search Bar */}
                  <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="w-full max-w-lg lg:max-w-xs">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative text-gray-400 focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                          id="search"
                          className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600 sm:text-sm sm:leading-6"
                          placeholder="Search"
                          type="search"
                          name="search"
                        />
                      </div>
                    </div>
                  </div>
                  {/* User Profile & Notification */}
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-cyan-600 p-1 text-white hover:bg-cyan-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-cyan-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                              {user.email ? user.email[0].toUpperCase() : ''}
                            </div>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-cyan-800'
                                    )}
                                    onClick={item.action ? (e) => {
                                      e.preventDefault();
                                      item.action(e);
                                    } : undefined}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}

                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-cyan-600 p-2 text-white hover:bg-cyan-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </header>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      onClick={() => handleNavigationClick(item.name)}
                      className={classNames(
                        item.current
                          ? 'bg-cyan-700 text-white'
                          : 'text-white hover:bg-cyan-500 hover:bg-opacity-75',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                {/* Profile options for mobile view */}
                <div className="border-t border-cyan-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-cyan-800">
                        {user.email ? user.email[0].toUpperCase() : ''}
                      </div>

                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-cyan-800">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full border-2 border-transparent bg-cyan-600 p-1 text-white hover:bg-cyan-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-cyan-500 hover:bg-opacity-75"
                        onClick={item.action}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </Fragment>
          )}
        </Disclosure>

        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
            <MapComponent isAddBathroomMode={isAddBathroomMode} />
          </div>
        </main>
      </div>
    </Fragment >
  );
}
