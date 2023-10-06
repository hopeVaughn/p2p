import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/hooks";
import { useNavigate } from 'react-router-dom';
import { HeadLogo } from "./Components";
import { useLocation } from "react-router-dom";
export default function SignupRegister() {
  const location = useLocation();
  const fromSignUp = location.state?.fromSignUp as boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(fromSignUp ? false : true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const handleAction = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    // Conditional rendering logical check to compare passwords for signUp
    if (!registered && (password !== confirmPassword)) {
      setPasswordError('Passwords must match before submitting');

      setTimeout(() => {
        setPasswordError(null);
      }, 3000);
      return;
    }
    if (email && password) {
      let wasSuccessful = false;
      if (registered) {
        setLoading(true);
        wasSuccessful = await signIn(email, password);  // Use the signIn function
        console.log("response object:", wasSuccessful);
        setLoading(false);
      } else {
        wasSuccessful = await signUp(email, password);
      }

      if (wasSuccessful) {
        navigate('/dashboard');
      } else {
        setValidationError("Invalid Credentials");

        setTimeout(() => {
          setValidationError(null);
        }, 3000);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAction();
  };

  const toggleRegistration = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setRegistered(!registered);
  };

  return (
    <section>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <HeadLogo />
          <Link
            to="/"
            className=" text-cyan-600 hover:text-cyan-500 mt-1"
          >Back to main page</Link>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-cyan-900">
            {registered ? "Sign in to your account" : "Register for a new account"}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <fieldset>
              {validationError && <p className="text-red-900 text-center">{validationError}</p>}
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-cyan-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-cyan-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                />
              </div>
            </fieldset>
            <fieldset>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                {registered && (
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-cyan-600 hover:text-cyan-500">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                />
              </div>
            </fieldset>
            {!registered && (
              <fieldset>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    ref={confirmPasswordRef}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                  {passwordError && <p className='text-red-900 text-center'>{passwordError}</p>}
                </div>
              </fieldset>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                {registered ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            {registered ? (
              <span>Not a member?{' '}
                <a href="#" onClick={toggleRegistration} className="font-semibold leading-6 text-cyan-600 hover:text-cyan-500">
                  Register For Free Here!
                </a>
              </span>
            ) : (
              <span>Already a member?{' '}
                <a href="#" onClick={toggleRegistration} className="font-semibold leading-6 text-cyan-600 hover:text-cyan-500">
                  Sign In Here!
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}


