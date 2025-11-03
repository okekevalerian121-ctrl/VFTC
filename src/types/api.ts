export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface ValidationError extends ApiError {
  field: string
}

export interface UserStats {
  totalEarned: number
  tasksCompleted: number
  tasksInProgress: number
  currentBalance: number
  membershipTier: string
  joinDate: Date
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTasks: number
  activeTasks: number
  totalRevenue: number
  totalPayouts: number
  pendingWithdrawals: number
  pendingSubmissions: number
}