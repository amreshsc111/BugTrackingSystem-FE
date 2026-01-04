export type UserRole = "Admin" | "Developer" | "Reporter"

export const BugStatus = {
  Open: 1,
  InProgress: 2,
  Resolved: 3,
  Closed: 4,
} as const;

export type BugStatus = typeof BugStatus[keyof typeof BugStatus];

export interface BugStatusInfo {
  id: number
  name: string
}

export type BugPriority = "Low" | "Medium" | "High" | "Critical"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  canReportBugs: boolean
  avatar?: string
}

export interface Bug {
  id: string
  title: string
  description?: string
  priority: string
  status: BugStatus | number
  createdDate: string
  reporterName?: string
  assignedToName?: string
  reproductionSteps?: string
  attachments?: BugAttachment[]
}

export interface BugAttachment {
  id: string
  fileName: string
  contentType: string
  length: number
  uploadedAt: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiration: string
  canReportBugs: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  userName: string
  email: string
  password: string
  roleId: number
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, roleId: number) => Promise<void>
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
}
