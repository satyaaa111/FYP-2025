"use client";

import React from "react";
import { cn } from "@/utils/cn"; // utility to merge class names

export const Badge = ({ children, className, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
