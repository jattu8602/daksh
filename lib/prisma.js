import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
const globalForPrisma = global;

// Prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;