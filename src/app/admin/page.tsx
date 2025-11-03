import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Users,
  ListTodo,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react'

async function getAdminStats() {
  const [
    totalUsers,
    activeUsers,
    totalTasks,
    activeTasks,
    totalRevenue,
    totalPayouts,
    pendingSubmissions,
    pendingWithdrawals
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        isActive: true,
        role: 'USER'
      }
    }),
    prisma.task.count(),
    prisma.task.count({
      where: {
        status: 'ACTIVE'
      }
    }),
    prisma.transaction.aggregate({
      where: {
        type: 'TASK_REWARD',
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: {
        type: 'WITHDRAWAL',
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    }),
    prisma.userTask.count({
      where: {
        status: 'SUBMITTED'
      }
    }),
    prisma.transaction.count({
      where: {
        type: 'WITHDRAWAL',
        status: 'PENDING'
      }
    })
  ])

  return {
    totalUsers,
    activeUsers,
    totalTasks,
    activeTasks,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalPayouts: totalPayouts._sum.amount || 0,
    pendingSubmissions,
    pendingWithdrawals
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const stats = await getAdminStats()

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      description: `${stats.activeUsers} active users`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Tasks',
      value: stats.activeTasks.toString(),
      description: `Total: ${stats.totalTasks} tasks`,
      icon: ListTodo,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Platform Revenue',
      value: formatCurrency(Number(stats.totalRevenue)),
      description: 'From all completed tasks',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Total Payouts',
      value: formatCurrency(Number(stats.totalPayouts)),
      description: 'Processed withdrawals',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+22%',
      changeType: 'positive'
    }
  ]

  const actionCards = [
    {
      title: 'Pending Submissions',
      value: stats.pendingSubmissions.toString(),
      description: 'Tasks awaiting review',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/admin/submissions'
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals.toString(),
      description: 'Payment requests to process',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/withdrawals'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance and user activity.
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
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <span className="text-xs text-green-600 font-medium">
                  {card.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <div className="grid gap-6 md:grid-cols-2">
        {actionCards.map((card) => (
          <Card key={card.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>
            Key performance metrics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Registered Users</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <ListTodo className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.activeTasks}</div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatCurrency(Number(stats.totalRevenue))}</div>
              <div className="text-sm text-muted-foreground">Total Platform Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}