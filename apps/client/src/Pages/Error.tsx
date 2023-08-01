import React from 'react';
import { server_down } from '../assets';

const Error: React.FC = () => {
  return (
    <main className='flex flex-col items-center justify-center bg-gray-100 min-h-screen text-center md:px-0 relative'>
      <h1 className='text-6xl text-teal-800 mt-4 text-center pb-10 w-full'>Somethings Wrong!</h1>
      <img src={server_down} className='mx-auto max-w-full h-[65vh]' alt="server_down" />
      <p className='text-4xl md:py-16 text-teal-900 text-center w-full'>We're working on it!
        <a href="#" className='pl-4 text-3xl text-teal-600 text-center w-full'>Go Back</a>
      </p>
    </main>
  )
}

export default Error;
