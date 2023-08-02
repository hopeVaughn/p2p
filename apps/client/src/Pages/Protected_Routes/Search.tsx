import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../../Global_Components/Navbar'
import Sidebar from '../../Global_Components/Sidebar'
import FormRow from '../../Global_Components/FormRow'
import { tourist_map } from '../../assets'
import Footer from '../../Global_Components/Footer'
import { user_navigation } from '../../utils/linkData'

const Search: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNavbarHeight(navbarRef.current?.offsetHeight || 0);
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className='relative bg-orange-100 min-h-screen flex flex-col'>
      <header ref={navbarRef} className="fixed inset-x-0 top-0 z-50">
        <Navbar navigation={user_navigation} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrolled={scrolled} navbarHeight={navbarHeight} buttons={false} />
        <Sidebar navigation={user_navigation} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} buttons={false} />
      </header>
      <section className="flex-grow" style={{ paddingTop: navbarHeight }}>
        <form action="">
          <FormRow labelText='Search' id='search' name='search' type='text' />
        </form>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div>
            <img src={tourist_map} alt="" className="w-full object-cover" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default Search
