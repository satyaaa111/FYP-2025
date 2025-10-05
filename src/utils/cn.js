import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for combining Tailwind classes conditionally
 * @param  {...any} inputs - class names, conditions, objects
 * @returns {string} merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}