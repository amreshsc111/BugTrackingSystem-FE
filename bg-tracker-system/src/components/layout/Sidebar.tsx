import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/Button"

export default function Sidebar() {
    const { user, logout } = useAuth()

    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col h-full relative">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">BugTracker</h1>
            </div>

            <nav className="flex-1 space-y-2 px-4">
                <NavItem to="/" label="Dashboard" />
                {user?.role === "Admin" && <NavItem to="/users" label="Users" />}
            </nav>

            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 mb-4">
                    <img src={user?.avatar || "/placeholder.svg"} alt={user?.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                    </div>
                </div>
                <Button
                    onClick={logout}
                    variant="destructive"
                    fullWidth
                    size="sm"
                >
                    Logout
                </Button>
            </div>
        </aside>
    )
}

function NavItem({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
            }
        >
            {label}
        </NavLink>
    )
}
