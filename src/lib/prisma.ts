/**
 * PrismaClient singleton.
 * In Next.js development mode the module is hot-reloaded on every change,
 * which would spawn a new client (and connection) each time.
 * Storing the instance on globalThis prevents that.
 */

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

function createClient() {
  const url = path.resolve(process.cwd(), 'dev.db')
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof createClient> | undefined
}

const prisma = globalThis.__prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export default prisma
