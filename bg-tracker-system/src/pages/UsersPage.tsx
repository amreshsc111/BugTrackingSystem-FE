import { useState } from "react"

interface TeamUser {
  id: string
  name: string
  email: string
  role: "Admin" | "Developer" | "Reporter"
  avatar: string
  bugsAssigned: number
  bugsClosed: number
  status: "Active" | "Inactive"
  joinDate: string
}

const MOCK_USERS: TeamUser[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@bug.com",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    bugsAssigned: 0,
    bugsClosed: 0,
    status: "Active",
    joinDate: "2024-01-01",
  },
  {
    id: "2",
    name: "John Developer",
    email: "dev@bug.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    bugsAssigned: 5,
    bugsClosed: 12,
    status: "Active",
    joinDate: "2024-01-05",
  },
  {
    id: "3",
    name: "Sarah Reporter",
    email: "reporter@bug.com",
    role: "Reporter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reporter",
    bugsAssigned: 0,
    bugsClosed: 0,
    status: "Active",
    joinDate: "2024-01-10",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<TeamUser[]>(MOCK_USERS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null)
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", role: "Developer" })

  const handleAddUser = () => {
    if (!newUserForm.name || !newUserForm.email) return

    const newUser: TeamUser = {
      id: (Math.max(...users.map((u) => Number.parseInt(u.id))) + 1).toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role as "Admin" | "Developer" | "Reporter",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUserForm.email}`,
      bugsAssigned: 0,
      bugsClosed: 0,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    setNewUserForm({ name: "", email: "", role: "Developer" })
    setShowAddModal(false)
  }

  const handleEditUser = () => {
    if (!editingUser) return
    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)))
    setEditingUser(null)
    setShowEditModal(false)
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)))
  }

  const totalBugsAssigned = users.reduce((sum, u) => sum + u.bugsAssigned, 0)
  const totalBugsClosed = users.reduce((sum, u) => sum + u.bugsClosed, 0)
  const activeUsers = users.filter((u) => u.status === "Active").length

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-2">{users.length} team members</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            + Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Active Users</p>
            <p className="text-2xl font-bold text-success">{activeUsers}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Bugs Assigned</p>
            <p className="text-2xl font-bold text-warning">{totalBugsAssigned}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Bugs Closed</p>
            <p className="text-2xl font-bold text-success">{totalBugsClosed}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block w-full border-collapse border-b border-border">
          <table className="w-full">
            <thead className="bg-muted/20 border-b border-border sticky top-0">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Assigned</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Closed</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-muted-foreground text-sm">{user.email}</td>
                  <td className="px-8 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "Admin"
                          ? "bg-destructive/10 text-destructive"
                          : user.role === "Developer"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-foreground font-medium">{user.bugsAssigned}</td>
                  <td className="px-8 py-4 text-foreground font-medium">{user.bugsClosed}</td>
                  <td className="px-8 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(user)
                        setShowEditModal(true)
                      }}
                      className="px-2 py-1 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="px-2 py-1 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
                    >
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-2 py-1 border border-destructive/50 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-foreground mb-4">Add New User</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Reporter">Reporter</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUserForm.name || !newUserForm.email}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit User</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as "Admin" | "Developer" | "Reporter" })
                  }
                  className="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Reporter">Reporter</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                }}
                className="flex-1 px-4 py-2 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
