import React from 'react'
import Button from '../../Global_Components/Buttons';
import { destination, informed, world } from '../../assets';

interface HeroProps {
  mobileMenuOpen: boolean
  id: string
}

const Hero: React.FC<HeroProps> = ({ mobileMenuOpen, id }) => {

  return (
    <section id={id} className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32 flex flex-col-reverse sm:flex-row">
      <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center order-1 sm:order-none">
        <article className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl lg:-mt-40">
          <h1 className="text-4xl font-bold tracking-tight text-teal-900 sm:text-6xl">
            Where convenience meets <span className="text-teal-600">community</span>
          </h1>
          <p className="relative mt-6 text-lg leading-relaxed text-gray-600 sm:max-w-md lg:max-w-none">
            Discover, share, and navigate to nearby bathrooms with ease
          </p>
          <div className="mt-10 flex justify-center md:justify-start items-center gap-x-6">
            {!mobileMenuOpen && (
              <div className="grow">
                <Button btnText='Sign Up For Free!' />
              </div>
            )}
          </div>
        </article>
        <figure className="mt-14 flex justify-start ml-auto gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
          {/* Image 1 */}
          <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80 transition-all duration-500 ease-in-out">
            <div className="relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 shadow-lg">
              <img
                src={destination}
                alt=""
                className={`absolute top-0 left-0 w-full h-full ${mobileMenuOpen ? "opacity-50" : "opacity-100"} sm:opacity-100`}
              />
            </div>
          </div>
          {/* Image 2 */}
          <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36 transition-all duration-500 ease-in-out">
            <div className="relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 shadow-lg">
              <img
                src={informed}
                alt=""
                className={`absolute top-0 left-0 w-full h-full ${mobileMenuOpen ? "opacity-50" : "opacity-100"} sm:opacity-100`}
              />
            </div>
            {/* Image 3 */}
            <div className="relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 shadow-lg">
              <img
                src={world}
                alt=""
                className={`absolute top-0 left-0 w-full h-full ${mobileMenuOpen ? "opacity-50" : "opacity-100"} sm:opacity-100`}
              />
            </div>
          </div>
        </figure>
      </div>
    </section>

  )
}

export default Hero