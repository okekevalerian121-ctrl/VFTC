import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ListTodo, Clock, DollarSign, Users, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

async function getAvailableTasks(userTier: string) {
  const tasks = await prisma.task.findMany({
    where: {
      status: 'ACTIVE',
      requiredTier: {
        in: ['BRONZE', userTier === 'SILVER' ? 'SILVER' : 'BRONZE', userTier === 'GOLD' ? 'GOLD' : 'BRONZE']
      },
      OR: [
        { maxParticipants: null },
        {
          maxParticipants: {
            gt: prisma.task.fields.currentParticipants
          }
        }
      ]
    },
    include: {
      creator: {
        select: {
          username: true,
          fullName: true
        }
      },
      _count: {
        select: {
          userTasks: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return tasks
}

const taskTypeColors = {
  SURVEY: 'bg-blue-100 text-blue-800',
  VIDEO_REVIEW: 'bg-purple-100 text-purple-800',
  CONTENT_CREATION: 'bg-green-100 text-green-800',
  QUESTIONNAIRE: 'bg-yellow-100 text-yellow-800',
  DATA_ENTRY: 'bg-orange-100 text-orange-800'
}

const taskTypeLabels = {
  SURVEY: 'Survey',
  VIDEO_REVIEW: 'Video Review',
  CONTENT_CREATION: 'Content Creation',
  QUESTIONNAIRE: 'Questionnaire',
  DATA_ENTRY: 'Data Entry'
}

export default async function TasksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const tasks = await getAvailableTasks(session.user.tier)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Tasks</h1>
        <p className="text-muted-foreground">
          Discover and complete tasks to earn money. {tasks.length} tasks available for your tier.
        </p>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tasks available</h3>
            <p className="text-muted-foreground mb-4">
              Check back later for new tasks that match your membership tier.
            </p>
            <Link href="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={taskTypeColors[task.type as keyof typeof taskTypeColors]}>
                        {taskTypeLabels[task.type as keyof typeof taskTypeLabels]}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {task.requiredTier}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {task.description}
                    </CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(Number(task.rewardAmount))}
                    </div>
                    <p className="text-sm text-muted-foreground">Reward</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{task._count.userTasks} participants</span>
                    </div>
                    {task.maxParticipants && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{task.maxParticipants - task._count.userTasks} spots left</span>
                      </div>
                    )}
                    {task.endDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Ends {task.endDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/dashboard/tasks/${task.id}`}>
                    <Button>
                      Start Task
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}