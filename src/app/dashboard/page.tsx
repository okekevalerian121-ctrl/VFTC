import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  DollarSign,
  ListTodo,
  TrendingUp,
  Clock,
  ArrowRight,
  Star,
  Users
} from 'lucide-react'
import Link from 'next/link'

async function getUserStats(userId: string) {
  const [
    user,
    totalEarned,
    tasksCompleted,
    tasksInProgress,
    availableTasks
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: true,
        membershipTier: true,
        createdAt: true
      }
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'TASK_REWARD',
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    }),
    prisma.userTask.count({
      where: {
        userId,
        status: 'APPROVED'
      }
    }),
    prisma.userTask.count({
      where: {
        userId,
        status: ['ASSIGNED', 'SUBMITTED']
      }
    }),
    prisma.task.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { maxParticipants: null },
          {
            maxParticipants: {
              gt: prisma.task.fields.currentParticipants
            }
          }
        ]
      }
    })
  ])

  return {
    walletBalance: user?.walletBalance || 0,
    membershipTier: user?.membershipTier || 'BRONZE',
    joinDate: user?.createdAt || new Date(),
    totalEarned: totalEarned._sum.amount || 0,
    tasksCompleted,
    tasksInProgress,
    availableTasks
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const stats = await getUserStats(session.user.id)

  const statsCards = [
    {
      title: 'Current Balance',
      value: formatCurrency(Number(stats.walletBalance)),
      description: 'Available for withdrawal',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Earned',
      value: formatCurrency(Number(stats.totalEarned)),
      description: 'Lifetime earnings',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted.toString(),
      description: 'Successfully finished',
      icon: ListTodo,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Tasks in Progress',
      value: stats.tasksInProgress.toString(),
      description: 'Currently working on',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const tierColors = {
    BRONZE: 'text-yellow-600 bg-yellow-50',
    SILVER: 'text-gray-600 bg-gray-50',
    GOLD: 'text-yellow-700 bg-yellow-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your earnings and activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Membership Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Membership Status
          </CardTitle>
          <CardDescription>
            Your current tier and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tierColors[stats.membershipTier as keyof typeof tierColors]}`}>
                {stats.membershipTier} Member
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {stats.joinDate.toLocaleDateString()}
              </p>
            </div>
            <Link href="/dashboard/upgrade">
              <Button variant="outline">
                Upgrade Tier
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Available Tasks
            </CardTitle>
            <CardDescription>
              {stats.availableTasks} tasks waiting for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Start completing tasks to earn money instantly. New tasks are added daily.
            </p>
            <Link href="/dashboard/tasks">
              <Button className="w-full">
                Browse Tasks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Wallet Management
            </CardTitle>
            <CardDescription>
              Manage your funds and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Deposit funds to access premium tasks or withdraw your earnings.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/wallet/deposit">
                <Button variant="outline" className="w-full">
                  Deposit
                </Button>
              </Link>
              <Link href="/dashboard/wallet">
                <Button variant="outline" className="w-full">
                  Withdraw
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest tasks and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity yet</p>
            <p className="text-sm">Start completing tasks to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}