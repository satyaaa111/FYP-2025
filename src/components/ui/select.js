"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-green-300  dark:text-gray-600 dark:placeholder:text-gray-500",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="w-4 h-4 ml-2" />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = SelectPrimitive.Value;
const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:text-gray-600 dark:border-green-300",
      className
    )}
    {...props}
  >
    <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
  </SelectPrimitive.Content>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-700 outline-none focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:text-gray-600 dark:focus:bg-green-300",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
      <Check className="w-4 h-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
