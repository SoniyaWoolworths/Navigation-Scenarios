const { test, expect } = require('@playwright/test');
const { readExcelFile, writeExcelFile } = require('../Utils/excel');
const data = readExcelFile('C:\\Users\\1502543\\Desktop\\NAVIGATION SCENARIOS\\testdata\\SearchScenariosAll.xlsx','Banking');
const filePath = 'C:\\Users\\1502543\\Desktop\\NAVIGATION SCENARIOS\\testdata\\SearchScenariosAll.xlsx';
const sheetName = 'Banking';
data.forEach(({ SERIALNO, USERNAME, PASSWORD, APPID, APPDESC, STATUS, FAILUREREASON }) => {
  test(`Fiori test ${SERIALNO} - ${APPDESC}`, async ({ page }) => {
    // test(`Fiori test ${SERIALNO} - ${APPID}`, async ({ page }) => {
    page.setDefaultTimeout(40000);
    page.setDefaultNavigationTimeout(40000);
    // Launch the SAP Fiori Launchpad
    await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300');
    //await page.screenshot({ path: 'C:\\Users\\1502543\\Desktop\\SONI Test\\launchpad.png' });
    // Login
     await page.pause();
    await page.getByRole('textbox', { name: 'User' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Log On' }).click();
    await page.waitForTimeout(3000);

    if (APPDESC) {
      await page.getByRole('button', { name: 'Open Search' }).click({ force: true });
      await page.waitForTimeout(1000);
      await expect(page.locator('#searchFieldInShell-select-labelText')).toHaveText('All', { timeout: 60000 });
      await page.locator('#searchFieldInShell-select-labelText').click();
      await page.waitForTimeout(1000);
      const appsOption = page.locator('li[role="option"]', { hasText: 'Apps' }).first();
      await appsOption.waitFor({ state: 'visible', timeout: 60000 });
      await expect(appsOption).toBeEnabled({ timeout: 60000 });
      //await page.getByRole('searchbox', { name: 'Search In: "All"' }).click();

      await appsOption.click();
      await page.getByRole('searchbox', { name: 'Search In: "Apps"' }).fill(APPDESC);
      await page.getByRole('searchbox', { name: 'Search In: "Apps"' }).press('Enter');
      await page.waitForTimeout(5000);
      /*await page.getByText('Apps').nth(0).click({ force: true });
      const searchdesc = ;
      await searchdesc.click();
      await searchdesc.fill(APPDESC);
      await searchdesc.press('Enter');*/
     
    // Wait for the dropdown option 'Apps' to be visible and click it
    //await page.getByText('Apps').nth(0).click({ force: true });
    //const appsOption = await page.getByText('Apps').nth(0).click({ force: true });
    /*const searchappdesc = await page.getByTitle('Search In: "Apps"').click();
    await searchappdesc.fill(APPDESC);
    await searchappdesc.press('Enter');
    
    //await appsOption.waitFor({ state: 'visible', timeout: 10000 });
    //const searchappdesc = await page.getByRole('searchbox', { name: 'Search In: "Apps"' }).fill(APPDESC);
    //await searchappdesc.click({ force: true });
    //await searchappdesc.fill(APPDESC);
    //await searchappdesc.press('Enter');
    //await page.waitForTimeout(2000);*/
    console.log("APPDESC searched globally");
    } else {
      console.log("APPDESC doesn't exist in global search");
    }
    if (await page.getByText("Results (1)").isVisible()) {
      
      // If result is 1, validate it matches APPDESC and click it
      await page.waitForTimeout(2000);
      //await expect(page.getByText(APPDESC)).toBeVisible();
      await page.getByText(APPDESC).click();
      console.log("One result found-APPDESCRIPTION");
    }
    else if (await page.getByText("Results (0)").isVisible()) {
      console.log("No result found-APPDESCRIPTION");
      await page.getByRole('button', { name: 'Back' }).click();
      await page.getByRole('button', { name: 'Open Search' }).click({ force: true });
      await page.locator('#searchFieldInShell-select-arrow').click();
      await page.getByText('Apps').nth(0).click({ force: true });
      const searchdesc = await page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await searchdesc.click();
      await searchdesc.fill(APPDESC.substring(0, 3));
      await searchdesc.press('Enter');
      console.log("APPDESC search with partial text for zero result");
    } else {
      // Multiple results or unknown state
      console.log("Multiple results found-APPDESCRIPTION");
      await page.getByRole('button', { name: 'Back' }).click();
      await page.waitForTimeout(3000);
      await page.locator('[title="Open Search"]').nth(0).click({ force: true });
      //await page.getByRole('button', { name: 'Open Search' }).click();
      await page.locator('#searchFieldInShell-select-arrow').click();
      await page.getByText('Apps').nth(0).click({ force: true });
      const searchdesc = await page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await searchdesc.click();
      await searchdesc.fill(APPDESC.substring(0, 3));
      await searchdesc.press('Enter');
      console.log("APPDESC search with partial text for multiple results");
    }

  });
});

test.afterEach(async ({}, testInfo) => {
  const match = testInfo.title.match(/Fiori test\s+(\d+)/); // Updated regex to match test title
  if (!match) {
    console.warn('SERIALNO not found in test title:', testInfo.title);
    return;
  }
  const serialNo = Number(match[1]);
  const excelRow = serialNo + 1; // Excel rows start at 1, header is row 1

  const status = testInfo.status === 'passed' ? 'PASS' : 'FAIL';
  const failureReason = testInfo.error?.message || '';

  // Write status to column J and failure reason to column K
  await writeExcelFile(filePath, sheetName, excelRow, 'J', status);
  await writeExcelFile(filePath, sheetName, excelRow, 'K', failureReason);
});