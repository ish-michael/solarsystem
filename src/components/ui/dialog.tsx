import * as React from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const Dialog = DialogPrimitives.Root;
const DialogTrigger = DialogPrimitives.Trigger;
const DialogPortal = DialogPrimitives.Portal;
const DialogClose = DialogPrimitives.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitives.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm ${className}`}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitives.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Content> & { isLightTheme?: boolean }
>(({ className = "", children, isLightTheme, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitives.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-2xl rounded-2xl ${
        isLightTheme 
          ? 'bg-stone-50 text-stone-900 border-stone-200' 
          : 'bg-slate-950 text-slate-100 border-slate-800'
      } ${className}`}
      {...props}
    >
      {children}
      <DialogPrimitives.Close className={`absolute right-4 top-4 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer ${
        isLightTheme ? 'hover:bg-stone-200' : 'hover:bg-slate-900'
      }`}>
        <X className="h-4 w-4" />
        <span className="sr-only">Schließen</span>
      </DialogPrimitives.Close>
    </DialogPrimitives.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitives.Content.displayName;

const DialogHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 text-left ${className}`}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Title>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitives.Title
    ref={ref}
    className={`text-lg font-bold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitives.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Description>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitives.Description
    ref={ref}
    className={`text-xs leading-relaxed ${className}`}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitives.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
