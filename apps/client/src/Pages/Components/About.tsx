import React from 'react';
import { snap_the_moment } from '../../assets';

const About: React.FC = () => {
  return (
    <main className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8 mb-10">
      <section className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-teal-900 sm:text-6xl">About Us</h2>
        </header>
        <article className="mt-6 lg:grid lg:grid-cols-2 lg:gap-8">
          <p className="text-2xl leading-8 text-teal-900 lg:col-span-2">
            At Societas, our mission is to empower individuals with real-time, community-sourced mapping solutions to locate bathrooms, fostering a more comfortable and accessible world.
          </p>
          <aside className="hidden lg:block">
            <img className="h-full w-full object-cover" src={snap_the_moment} alt="Illustration" />
          </aside>
          <div className="mt-10 md:mt-20 lg:mt-40 text-xl leading-7 text-teal-900"> {/* <-- Adjusted the margin-top classes here */}
            <p>
              We believe in the power of collaboration and shared knowledge to make daily navigation easier and more convenient. Leveraging the collective efforts of our users,
              we strive to cultivate an inclusive, user-friendly platform that transforms finding bathrooms into a seamless experience.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};
export default About;
