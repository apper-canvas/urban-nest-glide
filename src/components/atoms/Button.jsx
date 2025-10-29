import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-body font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:scale-105 focus:ring-primary",
    secondary: "bg-gradient-to-r from-secondary to-secondary-dark text-white hover:shadow-lg hover:scale-105 focus:ring-secondary",
    accent: "bg-gradient-to-r from-accent to-accent-dark text-white hover:shadow-lg hover:scale-105 focus:ring-accent",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary",
  };
  
  const sizes = {
    sm: "text-sm px-3 py-1.5 min-h-[36px]",
    md: "text-base px-5 py-2.5 min-h-[44px]",
    lg: "text-lg px-6 py-3 min-h-[52px]",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;