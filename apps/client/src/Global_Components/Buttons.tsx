import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  btnText: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', btnText, ...props }) => {
  const primaryStyles = 'button-blur-shadow bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded transform transition-all duration-300 hover:duration-500 ease-in-out hover:translate-y-[-3px] active:translate-y-[-1px]';
  const secondaryStyles = 'button-blur-shadow bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transform transition-all duration-300 hover:duration-500 ease-in-out hover:translate-y-[-3px] active:translate-y-[-1px]';

  const buttonStyle = variant === 'primary' ? primaryStyles : secondaryStyles;

  return (
    <button className={buttonStyle} {...props}>
      {btnText}
    </button>
  );
};

export default Button;