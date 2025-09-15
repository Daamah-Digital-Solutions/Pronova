import React, { Children, isValidElement } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  to, 
  href, 
  onClick, 
  className = '', 
  disabled = false,
  fullWidth = false,
  animated = true,
  ...props 
}) => {
  const getButtonClasses = () => {
    // Base classes for all buttons
    const baseClasses = 'relative font-medium transition-all duration-300 rounded-xl inline-flex items-center justify-center';
    
    // Size variations
    const sizeClasses = {
      small: 'text-sm py-2 px-4 gap-2',
      medium: 'text-base py-3 px-6 gap-2',
      large: 'text-lg py-3.5 px-7 gap-3'
    };
    
    // Get size class
    const sizeClass = sizeClasses[size] || sizeClasses.medium;
    
    // Variant styling
    let variantClass = '';
    
    if (variant === 'primary') {
      variantClass = 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50';
    } else if (variant === 'secondary') {
      variantClass = 'bg-secondary-500 hover:bg-secondary-600 text-dark-900 shadow-lg shadow-secondary-500/30 hover:shadow-secondary-500/50';
    } else if (variant === 'gradient') {
      variantClass = 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50';
    } else if (variant === 'outline') {
      variantClass = 'bg-transparent hover:bg-primary-600/10 text-primary-500 border-2 border-primary-600 hover:border-primary-500';
    } else if (variant === 'ghost') {
      variantClass = 'bg-transparent hover:bg-primary-600/10 text-primary-500';
    }
    
    // Width class - full width or default
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Disabled styling
    const disabledClass = disabled ? 'opacity-60 pointer-events-none' : '';
    
    return `${baseClasses} ${sizeClass} ${variantClass} ${widthClass} ${disabledClass} ${className}`;
  };
  
  // Handle children
  const renderChildren = () => {
    if (isValidElement(children) && children.type === 'span') {
      return children;
    }
    
    if (Array.isArray(children) || Children.count(children) > 1) {
      const childrenArray = Children.toArray(children);
      return childrenArray;
    }
    
    return children;
  };
  
  // Animation properties
  const animationProps = animated ? {
    whileHover: { translateY: -3 },
    whileTap: { translateY: 2, scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};
  
  // Button content
  const buttonContent = renderChildren();
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <motion.div {...animationProps}>
        <Link to={to} className={getButtonClasses()} {...props}>
          {buttonContent}
        </Link>
      </motion.div>
    );
  }
  
  // Render as anchor tag if 'href' prop is provided
  if (href) {
    return (
      <motion.div {...animationProps}>
        <a href={href} className={getButtonClasses()} target="_blank" rel="noopener noreferrer" {...props}>
          {buttonContent}
        </a>
      </motion.div>
    );
  }
  
  // Otherwise render as button
  return (
    <motion.button 
      className={getButtonClasses()} 
      onClick={onClick}
      disabled={disabled}
      {...animationProps} 
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;