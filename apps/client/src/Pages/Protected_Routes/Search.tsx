import React from 'react'
import FormRow from '../../Global_Components/FormRow'
import { tourist_map } from '../../assets'
import MobileNavbar from '../../Global_Components/MobileNavbar'

const Search: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false)

  return (
    <main className='relative bg-orange-100 min-h-screen flex flex-col items-center justify-between'>
      <section className="flex-grow flex flex-col items-center justify-center px-6 py-10">
        <form className="w-full max-w-md" action="">
          <FormRow labelText='Search' id='search' name='search' type='text' />
        </form>
        <div className="w-full max-w-7xl sm:px-6 lg:px-8">
          <img src={tourist_map} alt="tourist_map" className="w-full object-cover max-h-[50vh] mt-8" />
        </div>
      </section>
      <footer className="w-full">
        <MobileNavbar />
      </footer>
    </main>
  )
}

export default Search
