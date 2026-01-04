import type React from "react"

export interface BadgeProps {
  variant: "default" | "destructive" | "success" | "warning" | "info"
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    destructive: "bg-destructive/10 text-destructive border border-destructive/50",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-primary/10 text-primary",
  }

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
