import { cn } from "@/utils/cn";

const PriceTag = ({ price, className }) => {
  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1.5 rounded-lg",
      "bg-gradient-to-r from-secondary to-secondary-dark",
      "text-white font-display font-bold text-lg shadow-md",
      className
    )}>
      {formatPrice(price)}
    </div>
  );
};

export default PriceTag;