import React, { useState } from 'react'
import Button from '../Global_Components/Buttons';
import { destination, informed, world } from '../assets/';
import Navbar from '../Global_Components/Navbar';
import Sidebar from '../Global_Components/Sidebar';
import BackgroundPattern from '../Global_Components/BackgroundPattern';
const navigation = [
  { name: 'home', href: '#' },
  { name: 'about', href: '#' },
  { name: 'f.a.q', href: '#' },
  { name: 'contact', href: '#' },
]

const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  return (
    <div className="bg-orange-100">
      <header className="absolute inset-x-0 top-0 z-50">
        <Navbar navigation={navigation} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <Sidebar navigation={navigation} setMobileMenuOpen={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} />
      </header>
      <main className="relative isolate overflow-hidden">
        <BackgroundPattern />
        <section className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <article className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-teal-900 sm:text-6xl">
                Where convenience meets <span className="text-teal-600">community</span>
              </h1>
              <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                Discover, share, and navigate to nearby bathrooms with ease
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                {!mobileMenuOpen && (
                  <Button btnText='Sign Up' />
                )}
              </div>
            </article>
            <figure className="mt-14 flex justify-start ml-auto gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
              <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                <div className="relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 shadow-lg">
                  <img
                    src={destination}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
              <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                <div className="relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 shadow-lg">
                  <img
                    src={informed}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
                <div className="relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 shadow-lg">
                  <img
                    src={world}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            </figure>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing
