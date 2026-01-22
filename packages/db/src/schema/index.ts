import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const ping = pgTable('ping', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const pingSelectSchema = createSelectSchema(ping)
export const pingInsertSchema = createInsertSchema(ping)

export type Ping = z.infer<typeof pingSelectSchema>
export type NewPing = z.infer<typeof pingInsertSchema>
