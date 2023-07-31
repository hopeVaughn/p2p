import React, { useState, useEffect, useRef } from 'react'
import Hero from './Components/Hero';
import About from './Components/About';
import Faq from './Components/Faq';
import ContactForm from './Components/Contact';
import Footer from '../Global_Components/Footer';
import Navbar from '../Global_Components/Navbar';
import Sidebar from '../Global_Components/Sidebar';
import BackgroundPattern from '../Global_Components/BackgroundPattern';
import linkData from '../utils/linkData';

const Landing: React.FC = () => {
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

    <main className="relative bg-orange-100">
      <header ref={navbarRef} className="fixed inset-x-0 top-0 z-50">
        <Navbar navigation={linkData} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrolled={scrolled} navbarHeight={navbarHeight} />
        <Sidebar navigation={linkData} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </header>
      <section className="relative isolate overflow-hidden">
        <BackgroundPattern />
        <Hero mobileMenuOpen={mobileMenuOpen} id={'hero'} />
        <About id={'about'} />
        <Faq id={'faq'} />
        <ContactForm id={'contact'} />
        <Footer />
      </section>
    </main>
  )
}

export default Landing
