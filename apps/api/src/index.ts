import Fastify from 'fastify'
import { db } from '@fullstack/db'
import { sql } from 'drizzle-orm'

const fastify = Fastify({
  logger: true,
})

fastify.get('/health', async () => {
  await db.execute(sql`SELECT 1`)
  return { status: 'ok' }
})

const port = Number(process.env.PORT) || 3000

const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

const shutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully`)
  await fastify.close()
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

start()
