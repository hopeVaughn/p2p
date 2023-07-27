import React, { ReactNode } from 'react';
import Button from './Buttons';

interface FormBackdropProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

const FormBackdrop: React.FC<FormBackdropProps> = ({ onSubmit, children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center px-4 sm:px-0">
      <form
        onSubmit={onSubmit}
        className="w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 shadow-lg max-w-md px-2 sm:px-4 py-8 flex flex-col space-y-4 items-center mx-auto"
      >
        {children}
        <div className="mt-4 flex justify-center">
          <Button type="submit" variant="primary" btnText="Submit" />
        </div>
      </form>
    </div>
  );
};

export default FormBackdrop;
