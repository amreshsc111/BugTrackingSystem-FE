import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useBugDetails } from "../hooks/useBugDetails"
import { useLists } from "../hooks/useLists"
import { BugStatus } from "../types"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import toast from "react-hot-toast"

const STATUS_FLOW: Record<BugStatus, BugStatus[]> = {
  [BugStatus.Open]: [BugStatus.InProgress, BugStatus.Closed],
  [BugStatus.InProgress]: [BugStatus.Resolved, BugStatus.Open, BugStatus.Closed],
  [BugStatus.Resolved]: [BugStatus.Closed, BugStatus.InProgress],
  [BugStatus.Closed]: [BugStatus.Open, BugStatus.InProgress],
}

export default function BugDetailPage() {
  const { id: bugId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { bug, loading: bugLoading, error: bugError, updateStatus, assignBug } = useBugDetails(bugId)
  const { bugStatuses, loading: listsLoading, fetchBugStatuses } = useLists()
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    fetchBugStatuses()
  }, [fetchBugStatuses])

  const loading = bugLoading || (listsLoading && !bugStatuses.length)
  const error = bugError

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <p>Loading bug details...</p>
    </div>
  )

  if (error || !bug) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-destructive mb-4">{error || "Bug not found"}</p>
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    </div>
  )

  const handleStatusChange = async (newStatus: BugStatus) => {
    try {
      await updateStatus(newStatus)
      toast.success(`Status updated to ${bugStatuses.find(s => s.id === newStatus)?.name || newStatus}`)
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const handleAssignToMe = async () => {
    try {
      await assignBug()
      toast.success("Bug assigned to you")
    } catch (err) {
      toast.error("Failed to assign bug")
    }
  }

  const handleAddComment = () => {
    toast.error("Comment functionality not yet implemented in backend.")
    setNewComment("")
  }

  const currentStatus = Number(bug.status) as BugStatus

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <button onClick={() => navigate("/")} className="text-primary hover:text-primary/80 mb-4 font-medium text-sm">
          ← Back to Dashboard
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">{bug.title}</h1>
          <p className="text-muted-foreground">{bug.id}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main content */}
          <div className="col-span-2">
            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{bug.description || "No description provided."}</p>
            </div>

            {/* Reproduction Steps */}
            {bug.reproductionSteps && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Reproduction Steps</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {bug.reproductionSteps}
                </p>
              </div>
            )}

            {/* Attachments */}
            {bug.attachments && bug.attachments.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Attachments</h2>
                <div className="grid grid-cols-2 gap-4">
                  {bug.attachments.map((attachment) => (
                    <div key={attachment.id} className="border border-border rounded-lg overflow-hidden group p-4 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate" title={attachment.fileName}>{attachment.fileName}</p>
                          <p className="text-xs text-muted-foreground">{(attachment.length / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{attachment.contentType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">History</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Bug Reported</p>
                    <p className="text-sm text-muted-foreground">
                      by {bug.reporterName || "Unknown"} on {new Date(bug.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Add Comment</h2>
              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  className="w-full px-4 py-3 border border-input bg-background rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Status</h3>
              <div className="mb-4">
                <Badge
                  variant={
                    currentStatus === BugStatus.Open
                      ? "destructive"
                      : currentStatus === BugStatus.InProgress
                        ? "warning"
                        : currentStatus === BugStatus.Resolved
                          ? "info"
                          : "success"
                  }
                >
                  {bugStatuses.find(s => s.id === currentStatus)?.name || bug.status}
                </Badge>
              </div>
              {user?.role === "Developer" && (
                <div className="space-y-2">
                  {STATUS_FLOW[currentStatus]?.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md text-foreground hover:bg-muted transition-colors text-left"
                    >
                      → {bugStatuses.find(s => s.id === status)?.name || status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Priority</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    bug.priority === "Critical"
                      ? "destructive"
                      : bug.priority === "High"
                        ? "warning"
                        : bug.priority === "Medium"
                          ? "info"
                          : "default"
                  }
                >
                  {bug.priority}
                </Badge>
              </div>
            </div>

            {/* Assignment Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Assigned To</h3>
              {bug.assignedToName ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{bug.assignedToName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground text-sm mb-3">Unassigned</p>
                  {user?.role === "Developer" && (
                    <button
                      onClick={handleAssignToMe}
                      className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                      Assign to Me
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Details Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Reported by</p>
                  <p className="text-foreground font-medium">{bug.reporterName || "Unknown"}</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground mb-1">Created</p>
                  <p className="text-foreground font-medium">{new Date(bug.createdDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
