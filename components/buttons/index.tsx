import React, { ReactNode, MouseEvent } from 'react';

export type ButtonProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    primary?: boolean;
    label?: string;
};
  

const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick} type="button">
    {children}
  </button>
);

export default Button;
