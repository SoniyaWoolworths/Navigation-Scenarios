require('dotenv').config();
const { test, expect } = require('@playwright/test');

test('testBP - env credentials', async ({ page }) => {
  await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled');
  await page.getByRole('textbox', { name: 'User' }).fill(process.env.USERNAME1);
  //console.log('USERNAME:', process.env.USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).click();
  //console.log('PASSWORD:', process.env.PASSWORD);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD1);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.getByRole('listitem', { name: 'Master Data Group Accounting' }).click();
  await page.getByRole('link', { name: 'Maintain Business Partner Tile' }).click();
  const frame = await page.frame({ name: 'application-BusinessPartner-maintain-iframe' });
  await frame.locator('[id="M0:46:1:1:1:2B262::0:51-btn"]').click();
  await frame.getByRole('option', { name: 'Number', exact: true }).click();
  await frame.getByRole('button', { name: 'Enter' }).click();
 
});
