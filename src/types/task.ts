import { Task, TaskType, TaskStatus, UserTaskStatus, Tier } from '@prisma/client'

export interface TaskWithDetails extends Task {
  creator: {
    id: string
    username: string
    fullName?: string
  }
  attachments: TaskAttachment[]
  _count: {
    userTasks: number
  }
}

export interface UserTaskWithDetails {
  id: string
  status: UserTaskStatus
  submissionContent?: string
  earnedAmount?: number
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
  createdAt: Date
  updatedAt: Date
  task: TaskWithDetails
}

export interface TaskAttachment {
  id: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  createdAt: Date
}

export interface CreateTaskData {
  title: string
  description: string
  type: TaskType
  rewardAmount: number
  maxParticipants?: number
  startDate?: Date
  endDate?: Date
  requiredTier?: Tier
  attachments?: File[]
}

export interface TaskSubmissionData {
  taskId: string
  submissionContent?: string
  attachments?: File[]
}

export interface TaskReviewData {
  userTaskId: string
  status: UserTaskStatus
  earnedAmount?: number
  reviewNotes?: string
}