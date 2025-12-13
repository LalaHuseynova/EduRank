import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create test student user
  const student = await prisma.user.upsert({
    where: { email: 'student@ada.edu.az' },
    update: {},
    create: {
      email: 'student@ada.edu.az',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Student',
      role: 'STUDENT',
      isActive: true,
    },
  })

  console.log('✅ Created test student:', student.email)

  // Create test professor user
  const professor = await prisma.user.upsert({
    where: { email: 'professor@ada.edu.az' },
    update: {},
    create: {
      email: 'professor@ada.edu.az',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Professor',
      role: 'PROFESSOR',
      isActive: true,
    },
  })

  console.log('✅ Created test professor:', professor.email)

  // Create test admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ada.edu.az' },
    update: {},
    create: {
      email: 'admin@ada.edu.az',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Admin',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Created test admin:', admin.email)

  // Create admin profile for admin user
  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      permissions: ['all'],
    },
  })

  console.log('✅ Created admin profile')

  console.log('\n📝 Test Users Created:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Student:  student@ada.edu.az  / password123')
  console.log('Professor: professor@ada.edu.az / password123')
  console.log('Admin:    admin@ada.edu.az     / password123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

