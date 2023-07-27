import React, { ChangeEvent } from 'react';

interface FormRowProps {
  type: string;
  name: string;
  value: string | number;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  labelText?: string;
  placeholder?: string;
}

const FormRow: React.FC<FormRowProps> = ({ type, name, value, handleChange, labelText, placeholder }) => {
  return (
    <div className='form-row mt-4 text-teal-900 text-xl text-center'>
      <label htmlFor={name} className='form-label mr-3'>
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className='form-input bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 mt-1 focus:ring focus:ring-blue-300 focus:outline-none mx-auto'
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormRow;
