import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import * as tid from '../test-ids/ping'

const { Given, When, Then } = createBdd()

let lastPingId: number

Given('I am on the ping page', async ({ page }) => {
  await page.goto('/ping')
  await page.getByTestId(tid.PING_COUNT).waitFor()
})

When('I add a ping', async ({ page }) => {
  const countBefore = await page
    .getByTestId(tid.PING_LIST)
    .locator('li')
    .count()

  await page.getByTestId(tid.ADD_PING).click()
  await expect(page.getByTestId(tid.PING_LIST).locator('li')).toHaveCount(
    countBefore + 1
  )

  const lastItem = page.getByTestId(tid.PING_LIST).locator('li').last()
  const testId = (await lastItem.getAttribute('data-testid'))!
  lastPingId = Number(testId.replace('ping-item-', ''))
})

When('I add {int} pings', async ({ page }, count: number) => {
  for (let i = 0; i < count; i++) {
    const before = await page.getByTestId(tid.PING_LIST).locator('li').count()
    await page.getByTestId(tid.ADD_PING).click()
    await expect(page.getByTestId(tid.PING_LIST).locator('li')).toHaveCount(
      before + 1
    )
  }
})

When('I delete the last ping', async ({ page }) => {
  await page.getByTestId(tid.deletePing(lastPingId)).click()
  await expect(page.getByTestId(tid.pingItem(lastPingId))).toHaveCount(0)
})

Then('I should see the new ping in the list', async ({ page }) => {
  await expect(page.getByTestId(tid.pingItem(lastPingId))).toBeVisible()
})

Then(
  'I should see {int} pings in the list',
  async ({ page }, count: number) => {
    await expect(page.getByTestId(tid.PING_LIST).locator('li')).toHaveCount(
      count
    )
  }
)

Then('that ping should be gone from the list', async ({ page }) => {
  await expect(page.getByTestId(tid.pingItem(lastPingId))).toHaveCount(0)
})
