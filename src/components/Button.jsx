import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-text-primary hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    accent: 'bg-accent text-white hover:bg-cyan-600 focus:ring-accent disabled:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-gray-300',
    icon: 'bg-transparent hover:bg-gray-100 text-text-secondary hover:text-text-primary focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;