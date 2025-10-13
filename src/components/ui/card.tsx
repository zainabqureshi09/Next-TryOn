import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Local implementation of cn utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

// Root Card
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { gradient?: boolean }
>(({ className, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border transition-all duration-300 hover:shadow-lg",
      gradient 
        ? "bg-gradient-to-br from-card/90 to-card-dark/90 text-card-foreground shadow-md" 
        : "bg-card text-card-foreground shadow hover:scale-[1.01]",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// Header
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 animate-fadeIn", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Title
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-gradient", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground transition-opacity duration-200 group-hover:opacity-90", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 animate-fadeIn delay-75", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-0 animate-fadeIn delay-150", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
