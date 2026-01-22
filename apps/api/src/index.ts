import Fastify from 'fastify'
import { db, ping } from '@fullstack/db'
import { sql, eq } from 'drizzle-orm'

const fastify = Fastify({
  logger: true,
})

fastify.get('/health', async () => {
  await db.execute(sql`SELECT 1`)
  return { status: 'ok' }
})

// CRUD endpoints for ping
fastify.get('/pings', async () => {
  const pings = await db.select().from(ping)
  return pings
})

fastify.get<{ Params: { id: string } }>(
  '/pings/:id',
  async (request, reply) => {
    const id = Number(request.params.id)
    const [result] = await db.select().from(ping).where(eq(ping.id, id))
    if (!result) {
      return reply.status(404).send({ error: 'Ping not found' })
    }
    return result
  }
)

fastify.post('/pings', async (request, reply) => {
  const [result] = await db.insert(ping).values({}).returning()
  return reply.status(201).send(result)
})

fastify.delete<{ Params: { id: string } }>(
  '/pings/:id',
  async (request, reply) => {
    const id = Number(request.params.id)
    const [result] = await db.delete(ping).where(eq(ping.id, id)).returning()
    if (!result) {
      return reply.status(404).send({ error: 'Ping not found' })
    }
    return reply.status(204).send()
  }
)

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
