import React from 'react';
import { server_down } from '../assets';
import BackgroundPattern from '../Global_Components/BackgroundPattern';
const Error: React.FC = () => {
  return (
    <main className='flex flex-col items-center justify-center bg-gray-100 min-h-screen text-center md:px-0 relative'>
      <h1 className='text-5xl text-teal-800 mt-4 text-center pb-10 w-full z-10 '>Somethings Wrong!</h1>
      <img src={server_down} className='mx-auto max-w-full h-[65vh] z-10' alt="server_down" />
      <p className='text-4xl md:py-16 text-teal-900 text-center w-full flex flex-col z-10'>We're working on it!
        <a href="#" className='pl-4 text-2xl text-teal-600 text-center w-full z-10'>Go Back</a>
      </p>
      <section className="relative isolate overflow-hidden">
        <BackgroundPattern />
      </section>
    </main>
  )
}

export default Error;
