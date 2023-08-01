import React from 'react';
import { page_not_found } from '../assets';

const PageNotFound: React.FC = () => {
  return (
    <main className='flex flex-col items-center justify-center bg-gray-100 min-h-screen text-center md:px-0 relative'>
      <h1 className='text-6xl  text-teal-800 mt-4 text-center pb-10 w-full'>This page doesn't exist</h1>
      <img src={page_not_found} className='mx-auto max-w-full h-[65vh]' alt="age_not_found" />
      <p className='text-4xl md:py-16 text-teal-900 text-center w-full'>It happens....
        <a href="#" className='pl-4 text-3xl text-teal-600 text-center w-full'>Go Back</a>
      </p>
    </main>
  )
}

export default PageNotFound;
