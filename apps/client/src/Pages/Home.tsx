import { HeroSection, FeatureSection, FAQSection, TestimonialSection, ContactSection, FooterSection, NavBar } from './Components';


export default function HomePage() {
  return (
    <main className="bg-white">
      <NavBar />
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
