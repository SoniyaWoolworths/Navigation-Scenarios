const { test, expect } = require('@playwright/test');

test('Full billing document workflow', async ({ page }) => {
  // Login steps
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300');
  await page.fill('input[name="sap-user"]', 'T_OHD_ACCTNT');
  await page.fill('input[name="sap-password"]', 'Welcome@123');
  await page.click('button[type="submit"], #LOGON_BUTTON');
  await page.waitForLoadState('networkidle');
  await page.click('text=Transactions');
  await page.click('text=Display Billing Documents');

  // Billing document popup workflow
  //await page.getByTitle('Billing Document').click();
  //await page.locator('[title="Billing Document"]').nth(0).click();
  await page.locator('span').filter({ hasText: 'Billing Document', exact: true }).nth(0).click();
  await page.waitForSelector('table');
  await page.click('table tr:first-child');
  await page.click('button:text("OK")');
  await page.click('button:text("Continue")');
  await page.check('table input[type="checkbox"]:first-child');
  await page.click('button:text("Exit")');
});