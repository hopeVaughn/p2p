import { HeroSection, FeatureSection, FAQSection, TestimonialSection, ContactSection, FooterSection, NavBar } from './Components';


export default function HomePage() {
  return (
    <main>
      <NavBar />
      <header>
        <HeroSection />
      </header>

      <section id="features">
        <FeatureSection />
      </section>

      <section id='faq'>
        <FAQSection />
      </section>

      <section id='testimonials'>
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
