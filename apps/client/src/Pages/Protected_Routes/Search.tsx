import React, { useState } from 'react'
import Navbar from '../../Global_Components/Navbar'
import Sidebar from '../../Global_Components/Sidebar'
import FormRow from '../../Global_Components/FormRow'
import { tourist_map } from '../../assets'
const Search: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  return (
    <main className='bg-orange-100'>
      <header>
        {/* <Navbar />
        <SideBar /> */}
      </header>
      <section>
        <form action="">
          <label htmlFor="search" className="block text-sm font-semibold leading-6 text-teal-900">
            Search
          </label>
          <FormRow id='search' name='search' type='text' />
        </form>

        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div>
            <img src={tourist_map} alt="" className="w-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Search