import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormRowSelectProps {
  id: string;
  name: string;
  required?: boolean;
  labelText: string;
  className?: string;
  options: Option[];
  defaultValue?: string;
}

const FormRowSelect: React.FC<FormRowSelectProps> = ({
  id,
  name,
  required,
  labelText,
  className,
  options,
  defaultValue
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium leading-6 text-teal-900">
      {labelText}
    </label>
    <div className="mt-2">
      <select
        id={id}
        name={name}
        required={required}
        className={`block w-full rounded-md border-0 py-1.5 text-teal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 ${className}`}
        defaultValue={defaultValue}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FormRowSelect;
