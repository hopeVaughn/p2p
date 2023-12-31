import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { MapComponent, HeadLogo } from '.';
import { decodeAccessToken, accessTokenExpired } from '../../utils/helpers';
import { useLogout, useRefreshToken } from '../../utils/hooks';
import { useMapContext } from '../../utils/context/MapContextProvider';
import { SET_ZOOM_LEVEL, TOGGLE_ADD_BATHROOM_MODE, SET_CURRENT_NAVIGATION, SET_USER_LOCATION_MODE } from '../../utils/actions';

type DashboardProps = {
  children: React.ReactNode;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard({ children }: DashboardProps) {
  const navigate = useNavigate();
  const { dispatch, state } = useMapContext();
  const [navigation, setNavigation] = useState([
    { name: 'Search', current: state.currentNavigation === 'Search' },
    { name: 'Add Bathroom', current: state.currentNavigation === 'Add Bathroom' },
  ]);
  const { logout } = useLogout();
  const { refreshToken } = useRefreshToken();
  const userInfo = decodeAccessToken();



  useEffect(() => {
    // Update navigation state
    setNavigation(navigation.map(item => ({
      ...item,
      current: item.name === state.currentNavigation
    })));
  }, [state.currentNavigation]);


  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // If the access token has expired, attempt to refresh it
      if (accessTokenExpired()) {
        const refreshTokenSuccess = await attemptRefreshToken();
        if (!refreshTokenSuccess) {
          // Handle the case when the refresh token attempt fails
          console.error("Failed to refresh token");
          navigate('/login');
          return;
        }
      }

      // Proceed with logout
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      navigate('/'); // Navigate to home or login page
    }
  };

  const attemptRefreshToken = async () => {
    const activeRefreshToken = sessionStorage.getItem('refreshToken');
    if (!activeRefreshToken) {
      return false;
    }

    try {
      await refreshToken({ activeRefreshToken });
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  };


  const handleNavigationClick = (clickedItemName: string) => {
    setNavigation(prevNav =>
      prevNav.map(item => ({
        ...item,
        current: item.name === clickedItemName
      }))
    );
    // Update global state
    dispatch({ type: SET_CURRENT_NAVIGATION, payload: clickedItemName });
    // Adjust the zoom level
    if (clickedItemName === 'Add Bathroom') {
      dispatch({ type: TOGGLE_ADD_BATHROOM_MODE, payload: true });
      dispatch({ type: SET_USER_LOCATION_MODE, payload: false });
      dispatch({ type: SET_ZOOM_LEVEL, payload: 18 });
    } else if (clickedItemName === 'Search') {
      dispatch({ type: TOGGLE_ADD_BATHROOM_MODE, payload: false });
      dispatch({ type: SET_USER_LOCATION_MODE, payload: true });
      dispatch({ type: SET_ZOOM_LEVEL, payload: 16 });
    }
  };

  const user = {
    email: userInfo?.email
  };

  const userNavigation = [
    // { name: 'Your Profile' },
    // { name: 'Settings' },
    { name: 'Sign out', action: handleLogout },
  ];

  return (
    <Fragment>
      {/* main container */}
      <div className="min-h-full pb-12">

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
                          <button
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
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                  {/* Search Bar */}
                  {/* <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
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
                  </div> */}
                  {/* User Profile & Notification */}
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* <button
                        type="button"
                        className="relative rounded-full bg-cyan-600 p-1 text-white hover:bg-cyan-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button> */}

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
                                  <button
                                    className={classNames(
                                      active ? 'bg-gray-100 w-full' : '',
                                      'block px-4 py-2 text-sm text-cyan-800 text-left'
                                    )}
                                    onClick={item.action ? (e) => {
                                      e.preventDefault();
                                      item.action(e);
                                    } : undefined}
                                  >
                                    {item.name}
                                  </button>
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
                    {/* <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full border-2 border-transparent bg-cyan-600 p-1 text-white hover:bg-cyan-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-cyan-500 hover:bg-opacity-75 w-full text-left"
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
          <div className="mx-auto max-auto py-6 sm:px-6 lg:px-8">
            {children}
            <MapComponent />
          </div>
        </main>
      </div>
    </Fragment >
  );
}
