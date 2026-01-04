export interface Filter {
  id: string
  label: string
  value: string
  active: boolean
}

export interface FilterBarProps {
  filters: Filter[]
  onFilterChange: (filterId: string) => void
  onClearAll: () => void
}

export function FilterBar({ filters, onFilterChange, onClearAll }: FilterBarProps) {
  const activeCount = filters.filter((f) => f.active).length

  if (filters.length === 0) return null

  return (
    <div className="bg-muted/20 border-b border-border px-8 py-4">
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            {filter.label}
          </button>
        ))}
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
