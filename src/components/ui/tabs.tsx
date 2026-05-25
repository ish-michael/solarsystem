import * as React from "react";
import * as TabsPrimitives from "@radix-ui/react-tabs";

const Tabs = TabsPrimitives.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.List> & {
    isLightTheme?: boolean;
  }
>(({ className = "", isLightTheme, ...props }, ref) => (
  <TabsPrimitives.List
    ref={ref}
    className={`inline-flex items-center justify-center rounded-lg p-1 ${
      isLightTheme 
        ? "bg-stone-200/60 text-stone-600" 
        : "bg-slate-900/60 text-slate-400 border border-slate-800/80 backdrop-blur-md"
    } ${className}`}
    {...props}
  />
));
TabsList.displayName = TabsPrimitives.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger> & {
    isLightTheme?: boolean;
  }
>(({ className = "", isLightTheme, ...props }, ref) => (
  <TabsPrimitives.Trigger
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${
      isLightTheme 
        ? "data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm text-stone-600 hover:text-stone-900" 
        : "data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(79,70,229,0.4)] text-slate-400 hover:text-slate-100"
    } ${className}`}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitives.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Content>
>(({ className = "", ...props }, ref) => (
  <TabsPrimitives.Content
    ref={ref}
    className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitives.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
