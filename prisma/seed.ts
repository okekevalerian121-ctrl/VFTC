import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vftc.com' },
    update: {},
    create: {
      email: 'admin@vftc.com',
      username: 'admin',
      passwordHash: adminPassword,
      fullName: 'VFTC Admin',
      role: 'ADMIN',
      membershipTier: 'GOLD',
      walletBalance: 1000.00,
    }
  })

  // Create sample regular user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      username: 'testuser',
      passwordHash: userPassword,
      fullName: 'Test User',
      role: 'USER',
      membershipTier: 'BRONZE',
      walletBalance: 50.00,
    }
  })

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete Product Survey',
      description: 'Help us improve our products by completing this 10-minute survey about your shopping habits and preferences.',
      type: 'SURVEY',
      rewardAmount: 5.00,
      maxParticipants: 100,
      requiredTier: 'BRONZE',
      status: 'ACTIVE',
      createdBy: admin.id,
    },
    {
      title: 'Review YouTube Video',
      description: 'Watch a 5-minute promotional video and provide your honest feedback on the content, presentation, and overall message.',
      type: 'VIDEO_REVIEW',
      rewardAmount: 3.50,
      maxParticipants: 50,
      requiredTier: 'BRONZE',
      status: 'ACTIVE',
      createdBy: admin.id,
    },
    {
      title: 'Write Product Review',
      description: 'Write a detailed 300-word review for a new tech product. Include pros, cons, and who would benefit most from this product.',
      type: 'CONTENT_CREATION',
      rewardAmount: 10.00,
      maxParticipants: 20,
      requiredTier: 'SILVER',
      status: 'ACTIVE',
      createdBy: admin.id,
    },
    {
      title: 'Answer Questionnaire',
      description: 'Complete a comprehensive questionnaire about your digital habits and social media usage patterns.',
      type: 'QUESTIONNAIRE',
      rewardAmount: 2.00,
      maxParticipants: 200,
      requiredTier: 'BRONZE',
      status: 'ACTIVE',
      createdBy: admin.id,
    },
    {
      title: 'Data Entry Task',
      description: 'Enter business card information into our database. 50 cards provided in PDF format. Accuracy is important.',
      type: 'DATA_ENTRY',
      rewardAmount: 15.00,
      maxParticipants: 10,
      requiredTier: 'SILVER',
      status: 'ACTIVE',
      createdBy: admin.id,
    },
  ]

  for (const taskData of tasks) {
    await prisma.task.upsert({
      where: { title: taskData.title },
      update: {},
      create: taskData
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Admin user: admin@vftc.com (password: admin123)`)
  console.log(`Test user: user@example.com (password: user123)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })