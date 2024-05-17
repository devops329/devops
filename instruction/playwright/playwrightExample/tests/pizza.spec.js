import { test, expect } from 'playwright-test-coverage';

test('test', async ({ page }) => {
  const menuResponse = [{ title: 'Veggie', description: 'A garden of delight' }];

  // Mock out the service
  await page.route('*/**/api/order/menu', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuResponse });
  });

  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('heading', { name: 'Pizza' })).toBeVisible();
  await expect(page.getByText('👨‍🍳')).toBeVisible();

  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('list')).toContainText('Veggie - A garden of delight');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeDisabled();

  await page.getByPlaceholder('type').click();
  await page.getByPlaceholder('type').fill('onion');
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: 'Order' }).click();
  await expect(page.locator('i')).toContainText('Ordering 1 onion pizzas');
});
