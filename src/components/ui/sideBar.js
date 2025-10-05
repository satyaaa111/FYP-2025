"use client";

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import { Slot } from "@radix-ui/react-slot";
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    return useContext(SidebarContext);
};

export const Sidebar = ({ className, children }) => {
    const { isOpen } = useSidebar();
    return (
        <>
            <aside className={cn(
                "hidden md:flex md:flex-col md:w-80 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out",
                className
            )}>
                {children}
            </aside>
            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )} />
            <aside className={cn(
                "fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-950 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}>
                {children}
            </aside>
        </>
    );
};

export const SidebarTrigger = ({ className, ...props }) => {
    const { isOpen, setIsOpen } = useSidebar();
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn("md:hidden", className)}
            {...props}
        >
            {isOpen ? <X className="h-6 w-6" /> : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            )}
        </button>
    );
};

export const SidebarHeader = ({ className, children, ...props }) => (
    <div className={cn("flex-shrink-0", className)} {...props}>
        {children}
    </div>
);

export const SidebarContent = ({ className, children, ...props }) => (
    <div className={cn("flex-grow overflow-y-auto", className)} {...props}>
        {children}
    </div>
);

export const SidebarFooter = ({ className, children, ...props }) => (
    <div className={cn("flex-shrink-0", className)} {...props}>
        {children}
    </div>
);

export const SidebarGroup = ({ className, children, ...props }) => (
    <div className={cn("py-2", className)} {...props}>
        {children}
    </div>
);

export const SidebarGroupLabel = ({ className, children, ...props }) => (
    <h3 className={cn("px-4 py-2 text-xs font-semibold uppercase text-slate-500", className)} {...props}>
        {children}
    </h3>
);

export const SidebarGroupContent = ({ className, children, ...props }) => (
    <div className={cn(className)} {...props}>
        {children}
    </div>
);

export const SidebarMenu = ({ className, children, ...props }) => (
    <ul className={cn("space-y-1", className)} {...props}>
        {children}
    </ul>
);

export const SidebarMenuItem = ({ className, children, ...props }) => (
    <li className={cn(className)} {...props}>
        {children}
    </li>
);

export const SidebarMenuButton = ({ asChild = false, className, children, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn("block w-full text-left", className)} {...props}>
      {children}
    </Comp>
  );
};