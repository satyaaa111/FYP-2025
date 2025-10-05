"use client";

import React from "react";
import { cn } from "@/utils/cn";

/**
 * Skeleton component for loading placeholders
 * Props:
 *  - className: any Tailwind classes for width, height, border-radius, etc.
 */
export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
        className
      )}
      {...props}
    />
  );
};
