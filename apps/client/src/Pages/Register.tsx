import React, { useState } from "react"
import BackgroundPattern from "../Global_Components/BackgroundPattern"
import Logo from "../Global_Components/Logo"
import Footer from "../Global_Components/Footer"
import Button from "../Global_Components/Buttons"
import FormRow from "../Global_Components/FormRow"

const Register: React.FC = () => {
  const [registered, setRegistered] = useState<boolean>(true)

  const toggleRegistration = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setRegistered(!registered);
  };

  return (
    <main className="relative flex flex-col min-h-screen bg-orange-100">
      <div className="absolute left-0 top-0 h-10 w-auto">
        <Logo />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <BackgroundPattern />
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-20 text-center text-2xl leading-9 tracking-tight text-teal-900">
            {registered ? "Sign in to your account" : "Register for a new account"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <FormRow
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              labelText="Email address"
              placeholder=" Ex: email@email.com"
            />

            <FormRow
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              required
              labelText="Password"
              placeholder=" * * * * * * * "
            />

            {!registered && (
              <FormRow
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="password"
                required
                labelText="Confirm password"
                placeholder=" * * * * * * * "
              />
            )}

            <div className="mt-10 w-full">
              <Button variant="secondary" btnText={registered ? 'Sign In' : 'Sign Up'} />
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-teal-900">
            {registered ? (
              <span>Not a member?{' '}
                <a href="#" onClick={toggleRegistration} className="font-semibold leading-6 text-teal-600 hover:text-teal-500">
                  Register For Free Here!
                </a>
              </span>
            ) : (
              <span>Already a member?{' '}
                <a href="#" onClick={toggleRegistration} className="font-semibold leading-6 text-teal-600 hover:text-teal-500">
                  Sign In Here!
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Register;
