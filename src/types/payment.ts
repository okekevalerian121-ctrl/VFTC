import { Transaction, TransactionType, TransactionStatus, Tier } from '@prisma/client'

export interface TransactionWithDetails extends Transaction {
  user: {
    id: string
    username: string
    fullName?: string
    email: string
  }
}

export interface DepositData {
  amount: number
  paymentMethod: 'card'
}

export interface WithdrawalData {
  amount: number
  bankAccount?: {
    last4: string
    bankName: string
  }
}

export interface WalletBalance {
  currentBalance: number
  totalEarned: number
  totalDeposited: number
  totalWithdrawn: number
  pendingTransactions: number
}

export interface WithdrawalSettings {
  minimumAmount: number
  maximumAmount: number
  processingTimeDays: number
  feePercentage: number
  autoApprovalThreshold: number
  requireKYC: boolean
  allowedCountries: string[]
}

export const WITHDRAWAL_SETTINGS: Record<Tier, Omit<WithdrawalSettings, 'maximumAmount' | 'autoApprovalThreshold' | 'requireKYC' | 'allowedCountries'>> = {
  [Tier.BRONZE]: {
    minimumAmount: 10.00,
    processingTimeDays: 5,
    feePercentage: 0.05,
  },
  [Tier.SILVER]: {
    minimumAmount: 5.00,
    processingTimeDays: 3,
    feePercentage: 0.03,
  },
  [Tier.GOLD]: {
    minimumAmount: 1.00,
    processingTimeDays: 1,
    feePercentage: 0.01,
  },
}