import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "../types"
import { authService } from "../services/authService"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Synchronous initialization to prevent flicker/redirect
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (decoded.exp > currentTime) {
          return {
            id: decoded.nameid || decoded.sub,
            name: decoded.name || decoded.unique_name,
            email: decoded.email,
            role: decoded.role,
            canReportBugs: decoded.canReportBugs === "true",
          }
        }
      } catch (e) {
        console.error("Failed to decode token during sync init", e)
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Validate session on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          logout()
        }
      } catch (e) {
        console.error("Failed to decode token on mount", e)
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      localStorage.setItem("token", response.token)
      localStorage.setItem("refreshToken", response.refreshToken)

      const decoded: any = jwtDecode(response.token)
      const userData: User = {
        id: decoded.nameid || decoded.sub,
        name: decoded.name || decoded.unique_name,
        email: decoded.email || email,
        role: decoded.role,
        canReportBugs: response.canReportBugs,
      }
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Invalid credentials")
    }
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch (e) {
        console.error("Logout API call failed", e)
      }
    }
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
  }

  const register = async (name: string, email: string, password: string, roleId: number) => {
    try {
      await authService.register({ userName: name, email, password, roleId })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
