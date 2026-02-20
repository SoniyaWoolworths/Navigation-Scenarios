import { test, expect } from '@playwright/test';

test('test(F.13)', async ({ page }) => {
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled');
  await page.getByRole('textbox', { name: 'User' }).fill(process.env.USERNAME1);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD1);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.getByRole('listitem', { name: 'Transaction Banking Tile' }).click();
  await page.getByRole('link', { name: 'Clear Open Items' }).click();
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('button', { name: 'Get Variant...' }).click();
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Created By' }).click();
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Created By' }).press('ControlOrMeta+a');
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Created By' }).fill('');
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Variant' }).click();
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Variant' }).fill('WOWNZ');
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('button', { name: 'Execute (F8)' }).click();
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Document Number' }).click();
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('textbox', { name: 'Document Number' }).fill('2111859441');
  await page.locator('iframe[name="application-GLAccount-clearAutomatically-iframe"]').contentFrame().getByRole('button', { name: 'Execute' }).click();
});