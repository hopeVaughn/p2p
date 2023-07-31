import React, { useState } from 'react'
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

  return (
    <div className="bg-orange-100">
      <header className="absolute inset-x-0 top-0 z-50">
        <Navbar navigation={linkData} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
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
