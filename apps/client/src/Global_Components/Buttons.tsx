import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  btnText: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', btnText, ...props }) => {
  const primaryStyles = 'button-blur-shadow bg-cyan-700 text-white text-lg py-2 px-4 rounded flex-shrink-0';
  const secondaryStyles = 'button-blur-shadow bg-cyan-700 text-white text-lg py-2 px-4 rounded flex-shrink-0 w-full';

  const buttonStyle = variant === 'primary' ? primaryStyles : secondaryStyles;

  return (
    <button className={buttonStyle} {...props}>
      {btnText}
    </button>
  );
};

export default Button;
