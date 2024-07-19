import React from 'react';

interface KbdProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
}

const Kbd: React.FC<KbdProps> = ({ 
  children, 
  size = 'md', 
  variant = 'default', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-1 text-xs',
    md: 'py-[2px] px-[5px] !text-[10px]',
    lg: 'px-2.5 py-2 text-base'
  };

  const variantClasses = {
    default: 'bg-button-hover',
    outline: 'bg-transparent border-gray-300 dark:border-gray-600'
  };

  return (
    <kbd className={`
      font-thin text-gray-800 rounded-md 
      dark:text-gray-100 
      ${sizeClasses[size]} 
      ${variantClasses[variant]} 
      ${className}
    `}>
      {children}
    </kbd>
  );
};

export default Kbd;