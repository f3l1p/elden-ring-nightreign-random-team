"use client";

import { forwardRef } from "react";
import { clsx } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center font-cinzel font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none";

    const variants = {
      primary:
        "bg-gradient-to-b from-[#c5921a] to-[#8a5e10] text-[#0f0c07] border border-[#d4a843] hover:from-[#d4a843] hover:to-[#a87415] active:scale-[0.97] glow-gold-sm hover:glow-gold",
      ghost:
        "bg-transparent text-[#d4a843] border border-[rgba(197,146,26,0.3)] hover:border-[#d4a843] hover:bg-[rgba(197,146,26,0.08)] active:scale-[0.97]",
      outline:
        "bg-transparent text-[#d4a843] border-2 border-[#c5921a] hover:bg-[rgba(197,146,26,0.1)] active:scale-[0.97] glow-gold-sm",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs gap-1.5",
      md: "px-6 py-3 text-sm gap-2",
      lg: "px-8 py-3 text-sm gap-2",
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
