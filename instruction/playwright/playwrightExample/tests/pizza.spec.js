// @ts-check
import { test, expect } from '@playwright/test';

test('testLoadPage', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle('Playwright example');
});

test('testLoadPagex', async ({ page }) => {
  // let serverStoreJson = [
  //   { name: 'nyc', date: '2028-01-01' },
  //   { name: 'san diego', date: '2032-10-31' },
  // ];

  // // Mock out the server
  // await page.route('*/**/api/store', async (route) => {
  //   expect(route.request().method()).toBe('GET');
  //   await route.fulfill({ json: { store: serverStoreJson } });
  // });

  // await page.route('*/**/api/store/provo', async (route) => {
  //   expect(route.request().method()).toBe('POST');
  //   serverStoreJson = [...serverStoreJson, { name: 'provo', date: '2021-10-31' }];
  //   await route.fulfill({ json: { store: serverStoreJson } });
  // });

  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle('DevOps Demo');

  // // add a new store
  // await page.locator('css=input').fill('provo');
  // const addStoreBtn = page.getByRole('button', { name: 'Add' });
  // await addStoreBtn.click();
  // const storeTable = page.getByRole('cell', { name: 'provo' });
  // await expect(storeTable).toHaveText('provo');
});
