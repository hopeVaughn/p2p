import React from 'react'
import BackgroundPattern from '../../Global_Components/BackgroundPattern'
import UserNavbar from '../../Global_Components/UserNavbar'
import FormRow from '../../Global_Components/FormRow'
import Button from '../../Global_Components/Buttons'
const Profile: React.FC = () => {
  return (
    <main className='relative bg-orange-100 min-h-screen flex flex-col items-center justify-between'>
      <header className='pt-10 z-10'>
        <h2 className="text-3xl tracking-tight text-teal-900 sm:text-6xl z-10">Update Your Information</h2>
      </header>
      <section className="flex-grow flex flex-col relative isolate overflow-hidden items-center justify-center px-6 z-10">
        <form className="max-w-md z-10 flex flex-col items-center" action="">
          <FormRow
            labelText='Previous Password'
            id='previousPassword'
            name='previousPassword'
            type='password'
          />
          <FormRow
            labelText='New Password'
            id='newPassword'
            name='newPassword'
            type='password'
          />
          <FormRow
            labelText='Confirm New Password'
            id='confirmPassword'
            name='confirmPassword'
            type='password'
          />
          <Button btnText='Update' className='mt-4 mx-auto' />
        </form>
      </section>
      <footer className="w-full z-10">
        <UserNavbar />
      </footer>
      <section className="relative isolate overflow-hidden">
        <BackgroundPattern />
      </section>
    </main>
  )
}

export default Profile
