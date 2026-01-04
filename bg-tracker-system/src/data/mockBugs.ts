import type { Bug } from "../types"

// Mock bug data
export const MOCK_BUGS: Bug[] = [
  {
    id: "BUG-001",
    title: "Login form not accepting valid credentials",
    description: "Users report being unable to log in even with correct username and password.",
    reproductionSteps:
      "1. Navigate to login page\n2. Enter valid username and password\n3. Click Login button\n4. Observe error message instead of dashboard redirect",
    attachments: [
      {
        id: "att-001",
        name: "login-error-screenshot.png",
        type: "image/png",
        size: 245000,
        dataUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        uploadedAt: "2024-01-15T10:30:00Z",
      },
    ],
    status: "Open",
    priority: "Critical",
    reportedBy: {
      id: "3",
      name: "Sarah Reporter",
      email: "reporter@bug.com",
      role: "Reporter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reporter",
    },
    assignedTo: {
      id: "2",
      name: "John Developer",
      email: "dev@bug.com",
      role: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "BUG-002",
    title: "Dashboard loading slowly on large datasets",
    description: "When loading more than 1000 bugs, the dashboard becomes unresponsive.",
    reproductionSteps:
      "1. Create or load a dataset with 1000+ bugs\n2. Navigate to dashboard\n3. Wait for page to load\n4. Observe slow performance and UI lag",
    attachments: [
      {
        id: "att-002",
        name: "performance-logs.txt",
        type: "text/plain",
        size: 512000,
        dataUrl: "data:text/plain;base64,UGVyZm9ybWFuY2UgTG9nOiBEYXNoYm9hcmQgTG9hZGluZyBUaW1lcwoK",
        uploadedAt: "2024-01-14T14:20:00Z",
      },
      {
        id: "att-003",
        name: "dashboard-slow.png",
        type: "image/png",
        size: 328000,
        dataUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        uploadedAt: "2024-01-14T14:20:00Z",
      },
    ],
    status: "In Progress",
    priority: "High",
    reportedBy: {
      id: "3",
      name: "Sarah Reporter",
      email: "reporter@bug.com",
      role: "Reporter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reporter",
    },
    assignedTo: {
      id: "2",
      name: "John Developer",
      email: "dev@bug.com",
      role: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    },
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "BUG-003",
    title: "Export to CSV missing timestamps",
    description: "The exported CSV file does not include timestamp columns.",
    reproductionSteps:
      "1. Open any bug list\n2. Click Export to CSV button\n3. Open the downloaded CSV file\n4. Verify that timestamp columns are missing",
    attachments: [
      {
        id: "att-004",
        name: "expected-vs-actual.csv",
        type: "text/csv",
        size: 156000,
        dataUrl:
          "data:text/csv;base64,SWQsVGl0bGUsQ3JlYXRlZEF0LFVwZGF0ZWRBdApCVUctMDAxLExvZ2luIEVycm9yLDIwMjQtMDEtMTUsLApCVUctMDAyLERhc2hib2FyZCBTbG93LDIwMjQtMDEtMTQs",
        uploadedAt: "2024-01-13T08:45:00Z",
      },
    ],
    status: "Testing",
    priority: "Medium",
    reportedBy: {
      id: "3",
      name: "Sarah Reporter",
      email: "reporter@bug.com",
      role: "Reporter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reporter",
    },
    assignedTo: {
      id: "2",
      name: "John Developer",
      email: "dev@bug.com",
      role: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    },
    createdAt: "2024-01-13T08:45:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
  },
  {
    id: "BUG-004",
    title: "Email notifications not being sent",
    description: "Bug assignment emails are not reaching developers.",
    status: "Open",
    priority: "High",
    reportedBy: {
      id: "3",
      name: "Sarah Reporter",
      email: "reporter@bug.com",
      role: "Reporter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reporter",
    },
    assignedTo: undefined,
    createdAt: "2024-01-16T13:00:00Z",
    updatedAt: "2024-01-16T13:00:00Z",
  },
  {
    id: "BUG-005",
    title: "Typo in settings page",
    description: 'The word "Settigns" appears in the header.',
    status: "Closed",
    priority: "Low",
    reportedBy: {
      id: "3",
      name: "Sarah Reporter",
      email: "reporter@bug.com",
      role: "Reporter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reporter",
    },
    assignedTo: {
      id: "2",
      name: "John Developer",
      email: "dev@bug.com",
      role: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    },
    createdAt: "2024-01-10T16:30:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
]
