import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const getPrismaClient = () => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const databaseUrl = process.env.DATABASE_URL || 'file:dev.db';
  
  const filename = databaseUrl.startsWith('file:') 
    ? databaseUrl.replace(/^file:/, '') 
    : databaseUrl;
  const dirname = filename.includes('/') || filename.includes('\\')
    ? filename.substring(0, Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\')))
    : '';
  if (dirname && !fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
};

export const prisma = getPrismaClient();
export default prisma;
