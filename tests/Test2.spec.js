import { test, expect } from '@playwright/test';

test('test(CJ20N)', async ({ page }) => {
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled');
  await page.getByRole('textbox', { name: 'User' }).fill(process.env.USERNAME1);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD1);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.getByRole('listitem', { name: 'Master Data Group Accounting' }).click();
  await page.getByRole('link', { name: 'Project Builder Tile' }).click();
  //await page.locator('iframe[name="application-Project-process-iframe"]').contentFrame().getByRole('button', { name: 'Do not set options' }).click();
  await page.waitForTimeout(5000);
});