import { HeroSection, FeatureSection, FAQSection, TestimonialSection, ContactSection, FooterSection } from './Components';

// Import your components
// import HeroSection from './HeroSection';
// import FeatureSection from './FeatureSection';
// import FAQSection from './FAQSection';
// import TestimonialSection from './TestimonialSection';
// import ContactSection from './ContactSection';
// import FooterSection from './FooterSection';

export default function HomePage() {
  return (
    <main className="bg-white">
      <header>
        <HeroSection />
      </header>

      <section>
        <FeatureSection />
      </section>

      <section>
        <FAQSection />
      </section>

      <section>
        <TestimonialSection />
      </section>

      <section>
        <ContactSection />
      </section>

      <footer>
        <FooterSection />
      </footer>
    </main>
  );
}
