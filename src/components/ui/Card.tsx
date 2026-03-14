import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg 
        shadow 
        border border-gray-200 dark:border-gray-700
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;