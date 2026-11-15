"use client";

// shadcn/ui-style Dialog built on Radix: focus trap, Esc, scroll lock and aria wiring come from Radix.
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import type { ComponentProps } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-lenis-prevent className="fixed inset-0 z-50 bg-[#050806]/80 backdrop-blur-sm data-[state=open]:animate-[overlay-in_200ms_ease-out]" />
      <DialogPrimitive.Content
        data-lenis-prevent
        onOpenAutoFocus={(e) => {
          // Focus the dialog itself so screen readers start from the title, not the first thumbnail.
          e.preventDefault();
          (e.currentTarget as HTMLElement | null)?.focus();
        }}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-50 max-h-[92svh] overflow-y-auto overscroll-contain rounded-t-2xl bg-pine-900 shadow-2xl outline-none focus-visible:outline-none md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(1120px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl",
          "data-[state=open]:animate-[dialog-in_320ms_cubic-bezier(0.22,1,0.36,1)]",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
