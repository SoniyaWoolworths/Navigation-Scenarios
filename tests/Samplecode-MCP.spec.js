import { test } from '@playwright/test';

test('SAP Fiori Billing Document Flow', async ({ page }) => {
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300');
  await page.getByRole('textbox', { name: 'User' }).fill('T_OHD_ACCTNT');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Log On' }).click();

  await page.getByRole('listitem', { name: 'Transactions' }).click();
  await page.getByRole('link', { name: 'Display Billing Documents' }).click();
  await page.getByRole('button', { name: 'Input Field Help' }).click();

  // Wait for popup and select first row in the table
  const popupFrame = await page.frameLocator('iframe[name="application-BillingDocumentHelp-iframe"]');
  await popupFrame.locator('table tr').nth(1).click(); // nth(1) for first data row
  await popupFrame.getByRole('button', { name: 'OK' }).click();

  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole('button', { name: 'Exit' }).click();
});
