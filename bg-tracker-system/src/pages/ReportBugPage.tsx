import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { bugService } from "../services/bugService"
import { useLists } from "../hooks/useLists"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import toast from "react-hot-toast"

export default function ReportBugPage() {
    const navigate = useNavigate()
    const { severityLevels, developers, loading: listsLoading, fetchAllLists } = useLists()

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        severityId: "",
        reproductionSteps: "",
        assignedToId: "",
    })
    const [attachments, setAttachments] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchAllLists()
    }, [fetchAllLists])

    useEffect(() => {
        if (severityLevels.length > 0 && !form.severityId) {
            setForm(prev => ({ ...prev, severityId: severityLevels[0].id.toString() }))
        }
    }, [severityLevels, form.severityId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files).filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} is too large (max 10MB)`)
                return false
            }
            return true
        })

        setAttachments(prev => [...prev, ...newFiles])
    }

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.severityId) {
            toast.error("Please select a severity level")
            return
        }

        try {
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append("title", form.title)
            formData.append("description", form.description)
            formData.append("priority", form.priority)
            formData.append("severityId", form.severityId)
            formData.append("reproductionSteps", form.reproductionSteps)
            if (form.assignedToId) {
                formData.append("assignedToId", form.assignedToId)
            }

            attachments.forEach((file) => {
                formData.append("attachments", file)
            })

            await bugService.createBug(formData)
            toast.success("Bug reported successfully!")
            navigate("/")
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to report bug")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (listsLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p>Loading form...</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => navigate("/")} className="text-primary hover:text-primary/80 mb-4 font-medium text-sm">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-foreground">Report New Bug</h1>
                    <p className="text-muted-foreground mt-2">Provide as much detail as possible to help the team resolve the issue.</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
                                Bug Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={form.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                placeholder="e.g., Login button not responding on mobile"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                value={form.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm min-h-[100px]"
                                placeholder="Provide a detailed description of the bug..."
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label htmlFor="reproductionSteps" className="block text-sm font-semibold text-foreground mb-2">
                                Reproduction Steps
                            </label>
                            <textarea
                                id="reproductionSteps"
                                name="reproductionSteps"
                                value={form.reproductionSteps}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm min-h-[120px]"
                                placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="severityId" className="block text-sm font-semibold text-foreground mb-2">
                                    Severity
                                </label>
                                <select
                                    id="severityId"
                                    name="severityId"
                                    value={form.severityId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    {severityLevels.map(level => (
                                        <option key={level.id} value={level.id}>
                                            {level.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="assignedToId" className="block text-sm font-semibold text-foreground mb-2">
                                    Assign to Developer (Optional)
                                </label>
                                <select
                                    id="assignedToId"
                                    name="assignedToId"
                                    value={form.assignedToId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Unassigned</option>
                                    {developers.map(dev => (
                                        <option key={dev.id} value={dev.id}>
                                            {dev.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Attachments (Screenshots, Logs)
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                                accept="image/*,.pdf,.txt,.log"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Max 10MB per file. Supported: images, PDF, text, logs</p>

                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-semibold text-foreground">Attached Files:</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-destructive hover:text-destructive/80 text-sm font-medium px-2 py-1"
                                                    disabled={isSubmitting}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => navigate("/")} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
