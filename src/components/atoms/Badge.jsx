import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "primary", className, ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-secondary/20 text-secondary-dark border border-secondary/20",
    accent: "bg-gradient-to-r from-accent/10 to-accent/20 text-accent-dark border border-accent/20",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success border border-success/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-body",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;