import { cn } from "@/lib/utils/cn";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  width?: "default" | "wide" | "narrow";
  children?: ReactNode;
};

export function Container({
  as: Tag = "div",
  width = "default",
  className,
  children,
  ...rest
}: ContainerProps) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  } as const;
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8", widths[width], className)} {...rest}>
      {children}
    </Tag>
  );
}
