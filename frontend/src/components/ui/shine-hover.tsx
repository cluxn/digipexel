import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ShineButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => {
  return (
    <Button 
      variant="shine" 
      className={cn("relative overflow-hidden cursor-pointer bg-primary text-white", className)} 
      {...props}
    >
      {children}
    </Button>
  );
};

export default ShineButton;
