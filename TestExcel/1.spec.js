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
test.afterEach(async ({}, testInfo) => {
        // Check if this is the test for current ID
        if (testInfo.title.includes(`Fioritest ${SERIALNO} - ${APPDESC}`)) {
            const rowNumber = parseInt(SERIALNO) + 1;
            
            // Write status based on testInfo.status
            const status = testInfo.status === 'passed' ? 'Passed' : 
                          testInfo.status === 'failed' ? 'Failed' : 
                          testInfo.status === 'skipped' ? 'Skipped' : 
                          testInfo.status;
            
            writeExcelFile('testdata/BankingAll.xlsx', 'Sheet1', `J${rowNumber }`, status);
            
            // Write failure reason if test failed
            const failureReason = testInfo.status === 'failed' && testInfo.error 
                ? testInfo.error.message 
                : '';

            writeExcelFile('testdata/BankingAll.xlsx', 'Sheet1', `K${rowNumber}`, error);
        }
    });