const { test, expect } = require('@playwright/test');

test('SAP Fiori Billing Document Navigation', async ({ page }) => {
  // 1. Go to SAP Fiori Launchpad
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300', { waitUntil: 'domcontentloaded' });

  // 2. Enter username
  await page.fill('input[name="sap-user"]', 'T_OHD_ACCTNT');

  // 3. Enter password
  await page.fill('input[name="sap-password"]', 'Welcome@123');

  // 4. Click on logon button
  await page.click('button[type="submit"], button:has-text("Log On")');

  // 5. Wait for the launchpad to load
  await page.waitForLoadState('networkidle');

  // 6. Click on Transactions page (adjust selector as needed)
  await page.click('text=Transactions');

  // 7. Click on Display Billing Documents under Sales Order & Billing Document section
  await page.click('text=Display Billing Documents');

  // 8. Focus the billing document textbox and press F4 for input help
  await page.click('input[title*="Billing Document"]');
  await page.keyboard.press('F4');

  // 9. Wait for popup and select first row in the table
  await page.waitForSelector('div[role="dialog"] table');
  await page.click('div[role="dialog"] table tbody tr:first-child');

  // 10. In the popup click on ok button
  await page.click('div[role="dialog"] button:has-text("OK")');

  // 11. Click on continue button
  await page.click('button:has-text("Continue")');

  // 12. Wait for 10 seconds
  await page.waitForTimeout(10000);

  // 13. Click the exit button
  await page.click('button:has-text("Exit")');
});
