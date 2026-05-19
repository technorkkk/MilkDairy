import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

/**
 * Ensures a business exists in the database.
 * If no business is found, it auto-creates one with default values,
 * along with default milk prices and settings.
 * This prevents "No business found" errors on fresh installations.
 */
export async function ensureBusiness() {
  let business = await db.business.findFirst()

  if (!business) {
    // Create a default user first (use upsert to handle race conditions)
    const user = await db.user.upsert({
      where: { email: 'owner@dairy.com' },
      update: {},
      create: {
        name: 'Dairy Owner',
        email: 'owner@dairy.com',
        password: 'default123',
      },
    })

    // Create the business
    business = await db.business.create({
      data: {
        userId: user.id,
        name: 'My Dairy Farm',
        phone: '',
        address: '',
      },
    })

    // Create default milk prices
    await db.milkPrice.create({
      data: { businessId: business.id, type: 'COW', price: 50 },
    })
    await db.milkPrice.create({
      data: { businessId: business.id, type: 'BUFFALO', price: 60 },
    })

    // Create default settings
    await db.settings.create({
      data: {
        businessId: business.id,
        darkMode: false,
        retentionMonths: 5,
        currency: 'INR',
      },
    })
  }

  return business
}
