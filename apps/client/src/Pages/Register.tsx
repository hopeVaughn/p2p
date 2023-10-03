import React, { useState, useRef } from "react";
import { Logo, Footer, Button, FormRow, BackgroundPattern } from '../Global_Components';
import { useAuth } from "../utils/hooks";
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [registered, setRegistered] = useState<boolean>(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const toggleRegistration = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setRegistered(!registered);
  };

  const handleAction = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Is registered:", registered);

    if (email && password) {
      let success = false;
      if (registered) {
        success = await signIn(email, password);
      } else {
        success = await signUp(email, password);
      }

      if (success) {
        navigate('/search');
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    console.log("Form is submitting");

    event.preventDefault();
    handleAction();
  };

  return (
    <section className="relative flex flex-col min-h-screen bg-orange-100">
      <div className="absolute left-0 top-0 h-10 w-auto">
        <Logo />
      </div>
      <section className="relative isolate overflow-hidden">
        <BackgroundPattern />
      </section>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-20 text-center text-2xl leading-9 tracking-tight text-teal-900 z-10">
            {registered ? "Sign in to your account" : "Register for a new account"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6 z-10" onSubmit={handleSubmit}>
            <FormRow
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              labelText="Email address"
              placeholder=" Ex: email@email.com"
              ref={emailRef}
            />

            <FormRow
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              required
              labelText="Password"
              placeholder=" * * * * * * * "
              ref={passwordRef}
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
                ref={passwordRef}
              />
            )}

            <div className="mt-10 w-full">
              <Button
                variant="secondary"
                btnText={registered ? 'Sign In' : 'Sign Up'}
                type="submit"
                onClick={() => console.log("Button clicked!")}
              />

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
      <div className="z-10">
        <Footer />
      </div>
    </section>
  );
};

export default Register;
