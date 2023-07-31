import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="bg-orange-100">
      <header className="fixed inset-x-0 top-0 z-50">
        <Navbar navigation={linkData} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrolled={scrolled} />
        <Sidebar navigation={linkData} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </header>
      <main className="relative isolate overflow-hidden">
        <BackgroundPattern />
        <Hero mobileMenuOpen={mobileMenuOpen} />
        <About />
        <Faq />
        <ContactForm />
        <Footer />
      </main>
    </div>
  )
}

export default Landing
