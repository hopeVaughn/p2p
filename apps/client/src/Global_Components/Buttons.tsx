import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const primaryStyles = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
  const secondaryStyles = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';

  const buttonStyle = variant === 'primary' ? primaryStyles : secondaryStyles;

  return (
    <button className={buttonStyle} {...props}>
      {children}
    </button>
  );
};

export default Button;
