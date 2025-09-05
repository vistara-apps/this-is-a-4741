import React from 'react';

function Card({ 
  children, 
  variant = 'default',
  className = '',
  onClick,
  ...props 
}) {
  const baseClasses = 'bg-surface rounded-lg shadow-card transition-smooth';
  
  const variants = {
    default: 'p-4',
    highlighted: 'p-4 ring-2 ring-primary ring-opacity-50',
  };

  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${interactiveClasses} ${className}`;

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;