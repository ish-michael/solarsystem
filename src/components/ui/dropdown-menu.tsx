import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";

const DropdownMenu = DropdownMenuPrimitives.Root;
const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitives.Group;
const DropdownMenuPortal = DropdownMenuPrimitives.Portal;
const DropdownMenuSub = DropdownMenuPrimitives.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitives.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.SubTrigger> & {
    inset?: boolean;
  }
>(({ className = "", inset, children, ...props }, ref) => (
  <DropdownMenuPrimitives.SubTrigger
    ref={ref}
    className={`flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-slate-800 data-[state=open]:bg-slate-800 ${
      inset ? "pl-8" : ""
    } ${className}`}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitives.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitives.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.SubContent>
>(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitives.SubContent
    ref={ref}
    className={`z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-800 bg-slate-950 p-1 text-slate-100 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitives.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Content> & {
    isLightTheme?: boolean;
  }
>(({ className = "", sideOffset = 4, isLightTheme, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitives.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 min-w-[8rem] overflow-hidden rounded-lg border p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${
        isLightTheme 
          ? "border-stone-200 bg-stone-50 text-stone-900 shadow-stone-200/50" 
          : "border-slate-800 bg-slate-950 text-slate-100 shadow-black/50"
      } ${className}`}
      {...props}
    />
  </DropdownMenuPortal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitives.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Item> & {
    inset?: boolean;
    isLightTheme?: boolean;
  }
>(({ className = "", inset, isLightTheme, ...props }, ref) => (
  <DropdownMenuPrimitives.Item
    ref={ref}
    className={`relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
      isLightTheme 
        ? "focus:bg-stone-200 focus:text-stone-900" 
        : "focus:bg-slate-800 focus:text-slate-50"
    } ${inset ? "pl-8" : ""} ${className}`}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitives.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.CheckboxItem> & {
    isLightTheme?: boolean;
  }
>(({ className = "", children, checked, isLightTheme, ...props }, ref) => (
  <DropdownMenuPrimitives.CheckboxItem
    ref={ref}
    className={`relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
      isLightTheme 
        ? "focus:bg-stone-200 focus:text-stone-900 text-stone-900" 
        : "focus:bg-slate-800 focus:text-slate-50 text-slate-100"
    } ${className}`}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitives.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitives.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitives.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.RadioItem> & {
    isLightTheme?: boolean;
  }
>(({ className = "", children, isLightTheme, ...props }, ref) => (
  <DropdownMenuPrimitives.RadioItem
    ref={ref}
    className={`relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
      isLightTheme 
        ? "focus:bg-stone-200 focus:text-stone-900 text-stone-900" 
        : "focus:bg-slate-800 focus:text-slate-50 text-slate-100"
    } ${className}`}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitives.ItemIndicator>
        <div className={`h-1.5 w-1.5 rounded-full ${isLightTheme ? 'bg-stone-900' : 'bg-slate-50'}`} />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitives.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitives.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Label> & {
    inset?: boolean;
  }
>(({ className = "", inset, ...props }, ref) => (
  <DropdownMenuPrimitives.Label
    ref={ref}
    className={`px-2 py-1.5 text-xs font-semibold tracking-wider uppercase opacity-60 ${
      inset ? "pl-8" : ""
    } ${className}`}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitives.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Separator> & {
    isLightTheme?: boolean;
  }
>(({ className = "", isLightTheme, ...props }, ref) => (
  <DropdownMenuPrimitives.Separator
    ref={ref}
    className={`-mx-1 my-1 h-px ${isLightTheme ? 'bg-stone-200' : 'bg-slate-800'} ${className}`}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitives.Separator.displayName;

const DropdownMenuShortcut = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={`ml-auto text-xs tracking-widest opacity-60 ${className}`}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
