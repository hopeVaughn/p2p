import React from "react"
import BackgroundPattern from "../Global_Components/BackgroundPattern"
import Logo from "../Global_Components/Logo"
import Footer from "../Global_Components/Footer"
import Button from "../Global_Components/Buttons"
const Register: React.FC = () => {
  return (
    <main className="relative flex flex-col min-h-screen bg-orange-100">
      <div className="absolute left-0 top-0 h-10 w-auto">
        <Logo />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <BackgroundPattern />
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-20 text-center text-2xl leading-9 tracking-tight text-teal-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-teal-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-teal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-teal-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-teal-600 hover:text-teal-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-teal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-10 w-full">
              <Button variant="secondary" btnText='Sign In' />
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-teal-900">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-teal-600 hover:text-teal-500">
              Register For Free Here!
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Register;
