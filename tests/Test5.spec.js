import { test, expect } from '@playwright/test';

test('test(F0701A)', async ({ page }) => {
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled');
  await page.getByRole('textbox', { name: 'User' }).click();
  await page.getByRole('textbox', { name: 'User' }).fill(process.env.USERNAME1);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD1);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.getByRole('listitem', { name: 'Reporting - Review and' }).click();
  await page.getByRole('link', { name: 'Display Supplier Balances Tile' }).click();
  await
  await page.getByRole('textbox', { name: 'Fiscal Year:', exact: true }).click();
  await page.getByRole('textbox', { name: 'Fiscal Year:', exact: true }).fill('2026');
  await page.getByRole('textbox', { name: 'Company Code:' }).click();
  await page.getByRole('textbox', { name: 'Company Code:' }).fill('1000');
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  await page.getByText('03', { exact: true }).click();
  await page.getByText('03', { exact: true }).dblclick();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('link', { name: 'Manage Supplier Line Items' }).click();
  await page.getByRole('textbox', { name: 'Company Code:' }).click();
  await page.getByRole('textbox', { name: 'Company Code:' }).fill('1000');
  await page.getByRole('gridcell', { name: '1000' }).click();
  await page.locator('[id="application-Supplier-manageLineItems-component---fin.ap.lineitems.display.s1View--fin.ap.lineitems.display.CustomSelectClearingStatus-arrow"]').click();
  await page.getByRole('option', { name: 'Open Items' }).click();
  await page.getByRole('button', { name: 'Go', exact: true }).click();
});