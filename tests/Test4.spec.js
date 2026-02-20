import { test, expect } from '@playwright/test';

test('F0335A', async ({ page }) => {
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled');
  await page.getByRole('textbox', { name: 'User' }).fill(process.env.USERNAME2);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD2);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.getByRole('listitem', { name: 'Master Data' }).click();
  await page.getByRole('link', { name: 'Site Tile' }).click();
  await page.getByRole('textbox', { name: 'Site:' }).click();
  await page.getByRole('textbox', { name: 'Site:' }).fill('1005');
  await page.getByRole('gridcell', { name: '1005', exact: true }).click();
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  await page.getByTitle('Navigation', { exact: true }).click();
  await page.getByRole('option', { name: 'Promotions' }).click();
  await page.getByRole('option', { name: 'Product Groups' }).click();
  await page.getByRole('option', { name: 'Supplying Sites' }).click();
  await page.getByRole('option', { name: 'Assortments' }).click();
  await page.getByRole('option', { name: 'Allocation Tables' }).click();
  await page.getByRole('option', { name: 'Purchase Orders' }).click();
  await page.getByRole('option', { name: 'Receiving Points' }).click();
});