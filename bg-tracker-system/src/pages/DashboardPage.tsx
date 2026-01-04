import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useBugs } from "../hooks/useBugs"
import { useLists } from "../hooks/useLists"
import { useDebounce } from "../hooks/useDebounce"
import { BugStatus } from "../types"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"

type SortField = "created" | "updated" | "priority"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { bugs, loading: bugsLoading, error: bugsError } = useBugs()
  const { bugStatuses, loading: listsLoading, fetchAllLists } = useLists()

  const [filterStatus, setFilterStatus] = useState<number | "All">("All")
  const [filterPriority, setFilterPriority] = useState<string | "All">("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAllLists()
  }, [fetchAllLists])

  const loading = bugsLoading || listsLoading
  const error = bugsError

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const [sortBy, setSortBy] = useState<SortField>("created")
  const [sortDesc, setSortDesc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAndSortedBugs = useMemo(
    () =>
      bugs
        .filter((bug) => {
          const matchesStatus = filterStatus === "All" || bug.status === filterStatus
          const matchesPriority = filterPriority === "All" || bug.priority === filterPriority
          const matchesSearch =
            bug.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            bug.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          return matchesStatus && matchesPriority && matchesSearch
        })
        .sort((a, b) => {
          let aVal: any = ""
          let bVal: any = ""

          if (sortBy === "created") {
            aVal = new Date(a.createdDate).getTime()
            bVal = new Date(b.createdDate).getTime()
          } else if (sortBy === "updated") {
            aVal = new Date(a.createdDate).getTime()
            bVal = new Date(b.createdDate).getTime()
          } else if (sortBy === "priority") {
            const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 }
            aVal = priorityOrder[a.priority as keyof typeof priorityOrder]
            bVal = priorityOrder[b.priority as keyof typeof priorityOrder]
          }

          return sortDesc ? bVal - aVal : aVal - bVal
        }),
    [bugs, filterStatus, filterPriority, debouncedSearchQuery, sortBy, sortDesc],
  )

  const totalPages = Math.ceil(filteredAndSortedBugs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBugs = filteredAndSortedBugs.slice(startIndex, endIndex)

  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1)
    callback()
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bugs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b border-border px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bug Tracker</h1>
          </div>
          {user?.canReportBugs && (
            <Button
              onClick={() => navigate("/report-bug")}
            >
              + Report Bug
            </Button>
          )}
        </div>
      </div>

      <div className="border-b border-border px-8 py-3 bg-muted/5">
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchQuery}
            onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
            className="flex-1 min-w-48 px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value === "All" ? "All" : Number(e.target.value))}
            className="pl-3 pr-10 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            {bugStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => handleFilterChange(() => setFilterPriority(e.target.value))}
            className="px-3 py-2 border border-input bg-background text-sm text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => handleFilterChange(() => setSortBy(e.target.value as SortField))}
            className="px-3 py-2 border border-input bg-background text-sm text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="px-3 py-2 border border-input bg-background text-sm text-foreground rounded-md hover:bg-muted transition-colors"
            title={sortDesc ? "Descending" : "Ascending"}
          >
            {sortDesc ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Bug List */}
      <div className="flex-1 overflow-auto">
        {filteredAndSortedBugs.length > 0 ? (
          <>
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentBugs.map((bug) => (
                  <tr
                    key={bug.id}
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-semibold text-primary">{bug.id.substring(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground max-w-xs truncate block">{bug.title}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          bug.status === BugStatus.Open
                            ? "destructive"
                            : bug.status === BugStatus.InProgress
                              ? "warning"
                              : bug.status === BugStatus.Resolved
                                ? "info"
                                : "success"
                        }
                      >
                        {bugStatuses.find(s => Number(s.id) === Number(bug.status))?.name || bug.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={bug.priority === "Critical" ? "destructive" : "default"}>{bug.priority}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{bug.reporterName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {bug.assignedToName ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{bug.assignedToName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(bug.createdDate).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border px-8 py-4 bg-muted/5 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedBugs.length)} of{" "}
                {filteredAndSortedBugs.length} bugs
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-input bg-background text-sm text-foreground rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-md text-sm transition-colors ${currentPage === page
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "border border-input bg-background text-foreground hover:bg-muted"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-input bg-background text-sm text-foreground rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No bugs found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
