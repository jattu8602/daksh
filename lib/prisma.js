import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
const globalForPrisma = globalThis;

// Prevent multiple instances of Prisma Client in development
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;