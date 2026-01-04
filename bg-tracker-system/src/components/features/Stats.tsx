import type React from "react"
export interface StatCardProps {
  label: string
  value: string | number
  variant?: "default" | "success" | "warning" | "destructive"
  icon?: React.ReactNode
}

export function StatCard({ label, value, variant = "default", icon }: StatCardProps) {
  const variantBg = {
    default: "bg-muted/20",
    success: "bg-success/10",
    warning: "bg-warning/10",
    destructive: "bg-destructive/10",
  }

  return (
    <div className={`${variantBg[variant]} rounded-lg p-4 border border-border`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}
