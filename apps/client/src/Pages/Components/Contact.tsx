import React from 'react'
import Button from '../../Global_Components/Buttons'
import informed from '../../assets/informed.svg';

interface ContactFormProps {
  id: string
}
const ContactForm: React.FC<ContactFormProps> = ({ id }) => {

  return (
    <div id={id} className="flex items-start sm:justify-between">
      <section className="isolate bg-transparent px-6 py-24 sm:py-32 lg:px-8 flex-1">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl text-bold tracking-tight text-teal-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-2 text-lg leading-8 text-teal-900">
            Drop us a line and lets connect!
          </p>
        </div>
        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-teal-900">
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-teal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>
          </div>
          <div className="mt-10 w-full">
            <Button variant="secondary" btnText='Lets Talk!' />
          </div>
        </form>
      </section>
      <div className="w-full sm:mt-40 sm:w-1/2 sm:flex sm:justify-center sm:items-center hidden">
        <img
          src={informed}
          alt=""
          className="w-full h-auto sm:w-auto sm:max-w-md"
        />
      </div>
    </div>
  )
}

export default ContactForm