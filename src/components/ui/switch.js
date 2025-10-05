"use client";

import * as React from "react";
import { Switch as ShadcnSwitch } from "@radix-ui/react-switch";
import { cn } from "@/utils/cn"; // optional if you have cn helper for classNames

export function Switch({ checked, onCheckedChange, disabled, className }) {
  return (
    <ShadcnSwitch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        checked ? "bg-blue-600" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-[16px] w-[16px] rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </ShadcnSwitch>
  );
}
