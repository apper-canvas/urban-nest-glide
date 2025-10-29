import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-base font-body rounded-lg border-2 transition-all duration-200",
        "bg-white text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error ? "border-error focus:border-error focus:ring-error/20" : "border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;