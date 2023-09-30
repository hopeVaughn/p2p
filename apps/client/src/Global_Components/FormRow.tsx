import React from 'react';

interface FormRowProps {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  labelText: string;
  placeholder?: string;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const FormRow = React.forwardRef<HTMLInputElement, Omit<FormRowProps, 'inputRef'>>(
  ({ id, name, type, autoComplete, required, labelText, placeholder, className }, ref) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-teal-900">
        {labelText}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          className={`block w-full rounded-md border-0 py-1.5 text-teal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 ${className}`}
          ref={ref}
        />
      </div>
    </div>
  )
);

export default FormRow;
