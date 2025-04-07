
import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const cyberpunkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary/90 text-primary-foreground hover:bg-primary/80 after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-primary after:to-primary/60 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 shadow-neon-sm hover:shadow-neon-md border border-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-destructive after:to-destructive/60 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
        outline:
          "border border-primary/40 bg-background/20 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-neon-sm",
        secondary:
          "bg-secondary/90 text-secondary-foreground hover:bg-secondary/80 after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-secondary after:to-secondary/60 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline text-shadow-neon-sm",
        neon: "border border-primary/40 bg-background/20 text-primary hover:text-primary-foreground hover:bg-primary/90 shadow-neon-sm hover:shadow-neon-md text-shadow-neon-sm backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CyberpunkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberpunkButtonVariants> {
  asChild?: boolean;
  glitch?: boolean;
}

const CyberpunkButton = React.forwardRef<HTMLButtonElement, CyberpunkButtonProps>(
  ({ className, variant, size, asChild = false, glitch = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    if (glitch) {
      return (
        <Comp
          className={cn(cyberpunkButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="relative inline-block">
            {/* Glitch effect layers */}
            <span className="absolute inset-0 text-primary-foreground opacity-70" style={{
              clipPath: "polygon(0 30%, 100% 30%, 100% 50%, 0 50%)",
              transform: "translateX(-2px)",
              animation: "glitch-1 2s infinite linear alternate-reverse",
            }}>
              {children}
            </span>
            <span className="absolute inset-0 text-secondary-foreground opacity-70" style={{
              clipPath: "polygon(0 65%, 100% 65%, 100% 80%, 0 80%)",
              transform: "translateX(2px)",
              animation: "glitch-2 3s infinite linear alternate-reverse",
            }}>
              {children}
            </span>
            <span className="relative">{children}</span>
          </span>
        </Comp>
      );
    }
    
    return (
      <Comp
        className={cn(cyberpunkButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

CyberpunkButton.displayName = "CyberpunkButton";

export { CyberpunkButton, cyberpunkButtonVariants };
