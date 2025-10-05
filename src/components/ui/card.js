"use client";

import React from "react";
import { cn } from "@/utils/cn";

// Card wrapper
const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white shadow-sm dark:border-green-300",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

// Card header (optional)
const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 border-b border-gray-100 dark:border-gray-800", className)} {...props}>
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

// Card title (optional)
const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

// Card content
const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

// Card footer (optional)
const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 border-t border-gray-100 dark:border-gray-800", className)} {...props}>
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
