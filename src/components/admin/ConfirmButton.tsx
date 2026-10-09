"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";

/** A submit button that asks for confirmation first (used for deletes). */
export function ConfirmButton({
  confirm,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { confirm: string }) {
  function handle(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(confirm)) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }
  return <button type="submit" {...props} onClick={handle} />;
}
