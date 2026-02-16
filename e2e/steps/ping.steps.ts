import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

type Ping = { id: number; createdAt: string }

let lastPing: Ping
let createdPings: Ping[]
let pingsResponse: Ping[]

When('I create a ping', async ({ request }) => {
  const res = await request.post('/pings')
  expect(res.status()).toBe(201)
  lastPing = (await res.json()) as Ping
})

Then('I should see the new ping with a timestamp', () => {
  expect(lastPing.id).toBeDefined()
  expect(lastPing.createdAt).toBeDefined()
})

When('I look up that ping', async ({ request }) => {
  const res = await request.get(`/pings/${lastPing.id}`)
  expect(res.status()).toBe(200)
  lastPing = (await res.json()) as Ping
})

Then('I should find the same ping', () => {
  expect(lastPing.id).toBeDefined()
  expect(lastPing.createdAt).toBeDefined()
})

Given('I have created {int} pings', async ({ request }, count: number) => {
  createdPings = []
  for (let i = 0; i < count; i++) {
    const res = await request.post('/pings')
    expect(res.status()).toBe(201)
    createdPings.push((await res.json()) as Ping)
  }
})

When('I browse the ping history', async ({ request }) => {
  const res = await request.get('/pings')
  expect(res.status()).toBe(200)
  pingsResponse = (await res.json()) as Ping[]
})

Then('I should see all {int} pings in the list', ({}, count: number) => {
  const ids = createdPings.map((p) => p.id)
  const found = pingsResponse.filter((p) => ids.includes(p.id))
  expect(found).toHaveLength(count)
})

When('I delete that ping', async ({ request }) => {
  const res = await request.delete(`/pings/${lastPing.id}`)
  expect(res.status()).toBe(204)
})

Then('that ping should no longer exist', async ({ request }) => {
  const res = await request.get(`/pings/${lastPing.id}`)
  expect(res.status()).toBe(404)
})
