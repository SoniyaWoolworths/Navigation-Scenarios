const { test, expect } = require('@playwright/test');
const { readExcelFile, writeExcelFile } = require('../Utils/excel');
const data = readExcelFile('C:\\Users\\1502543\\Desktop\\NAVIGATION SCENARIOS\\testdata\\GroupAccountingAll.xlsx', 'Accountant');
const filePath = 'C:\\Users\\1502543\\Desktop\\NAVIGATION SCENARIOS\\testdata\\GroupAccountingAll.xlsx';
const sheetName = 'Accountant';
data.forEach(({ SERIALNO, USERNAME, PASSWORD, SPACE, PAGE, SECTION, APPID, APPDESC, USERROLE, STATUS, FAILUREREASON }) => {
 test(`Fioritest ${SERIALNO} - ${APPDESC}`, async ({ page }) => {
  // test(`Fiori test ${SERIALNO} - ${APPID}`, async ({ page }) => {
    page.setDefaultTimeout(120000);
    page.setDefaultNavigationTimeout(120000);
    // Launch the SAP Fiori Launchpad
    await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300');
    //await page.screenshot({ path: 'C:\\Users\\1502543\\Desktop\\SONI Test\\launchpad.png' });
    // Login
    await page.getByRole('textbox', { name: 'User' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Log On' }).click();
    await page.waitForTimeout(2000);
    // 3. Check for SPACE button
    const spaceLocator = page.locator('span').filter({ hasText: SPACE, exact: true }).nth(0);
    await spaceLocator.waitFor({ state: 'visible', timeout: 10000 });
    await spaceLocator.waitFor({ state: 'attached', timeout: 10000 });
    await expect(spaceLocator).toBeEnabled({ timeout: 10000 });
    if (await spaceLocator.isVisible() && await spaceLocator.isEnabled()) {
      console.log(SPACE + " is visible and enabled");
      const moreLocator = page.locator('[title="More"]').nth(0);
      await moreLocator.waitFor({ state: 'visible', timeout: 10000 });
      await expect(moreLocator).toBeEnabled({ timeout: 10000 });
      await moreLocator.click({ force: true });
      await page.waitForTimeout(2000); 
    }
    // Navigate to the required page
    if (PAGE) {
      //await page.getByText(Reporting Financial).click();
      try {
      //await page.getByRole('listitem', { name: PAGE }).click();
      await page.locator('[role="menuitem"]').filter({ hasText: PAGE }).click();
      console.log("page is opened");
      } catch (error) {
      console.log("page is not opened", error);
      return;
      }   
    }

    //await page.screenshot({ path: 'C:\\Users\\1502543\\Desktop\\SONI Test\\launchpad.png' });
    // 5. Validate APPDESC is present under SECTION
    const section = await page.locator('h3').filter({ hasText: SECTION ,exact: true }).isVisible();
    console.log("Section presence:", section);
    console.log("Section is visible");

    // 6. Click on search button and enter APPID
    if(SECTION){
    //await page.locator('span').filter({ hasText: APPDESC ,exact: true }).click();
    //await page.getByText(APPDESC, { exact: true }).click();
    // Wait for APPDESC link to be visible and enabled before clicking
    const appDescLink = page.getByRole('link', { name: APPDESC });
    //await appDescLink.waitFor({ state: 'visible', timeout: 10000 });
    //await expect(appDescLink).toBeEnabled({ timeout: 10000 });
    await appDescLink.click();
    await page.waitForTimeout(2000);
    console.log("APPDESC clicked inside the section");
    try {
      await page.getByRole('button', { name: 'Back' }).click();
      console.log("Back button clicked");
    }
    catch (error){
      //await page.getByRole('button', { name: 'OK' }).click();
      await page.locator('iframe[name="application-ProfitabilityAnalysis-executeReport-iframe"]').contentFrame().getByRole('button', { name: 'Close' }).click();
      console.log("Popup closed");
    }
    }
    /*await page.screenshot({ path: `C:\\Users\\1502543\\Desktop\\SONI Test\\step_${SERIALNO}_04.png` });
    await page.getByRole('button', { name: 'Open Search' }).click();
    await page.waitForTimeout(2000);
    //const searchappidinsection = await page.locator('input[aria-label="Search"]').nth(0);
    const searchappidinsection = await page.locator('[placeholder="Search"]').nth(0);
    await searchappidinsection.click();
    await searchappidinsection.fill(APPID);
    await searchappidinsection.press('Enter');
    await page.screenshot({ path: `C:\\Users\\1502543\\Desktop\\SONI Test\\step_${SERIALNO}_05.png` });
    console.log("APPID present inside the section");
    }
    else{
      console.log("APPID not present inside the section");
    }*/
    if(APPDESC){
      await page.getByRole('button', { name: 'Open Search' }).click();   
      await page.locator('#searchFieldInShell-select-arrow').click();
      // Wait for the dropdown option 'Apps' to be visible and click it
      const appsOption = page.locator('li[role="option"]', { hasText: 'Apps' }).first();
      await appsOption.waitFor({ state: 'visible', timeout: 10000 });
      await appsOption.click();
      await page.waitForTimeout(2000);
      const searchappdesc = await page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await searchappdesc.click();
      await searchappdesc.fill(APPDESC);
      await searchappdesc.press('Enter');
      await page.waitForTimeout(2000);
      console.log("APPDESC searched globally");
    }
    else{
      console.log("APPDESC doesn't exist in global search");
    }
    if (await page.getByText("Results (1)").isVisible()) {
      // If result is 1, validate it matches APPDESC and click it
      await page.waitForTimeout(2000);
      const appDescResult = page.getByText(APPDESC);
      //await expect(appDescResult).toBeVisible({ timeout: 10000 });
      //await expect(appDescResult).toBeEnabled({ timeout: 10000 });
      await appDescResult.click();
      console.log("One result found-APPDESCRIPTION");
    }
   else if (await page.getByText("Results (0)").isVisible()) {
      // If result is 0, log not present
      console.log("No result found-APPDESCRIPTION");
      await page.getByRole('button', { name: 'Back' }).click();
      await page.getByRole('button', { name: 'Open Search' }).click();
      await page.locator('#searchFieldInShell-select-arrow').click();  
      const appsOption2 = page.locator('li[role="option"]', { hasText: 'Apps' }).first();
      await appsOption2.waitFor({ state: 'visible', timeout: 10000 });
      await appsOption2.click();
      const searchdesc = await page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await searchdesc.click();
      await searchdesc.fill(APPDESC.substring(0,3));
      await searchdesc.press('Enter');
      console.log("APPDESC search with partial text");
    } else {
      // Multiple results or unknown state
      console.log("Multiple results found-APPDESCRIPTION");
      await page.getByRole('button', { name: 'Back' }).click();
      await page.waitForTimeout(3000);
      await page.locator('[title="Open Search"]').nth(0).click();
      //await page.getByRole('button', { name: 'Open Search' }).click();
      await page.locator('#searchFieldInShell-select-arrow').click();  
      const searchdesc = await page.locator('li[role="option"]', { hasText: 'Apps' }).first();
      await searchdesc.waitFor({ state: 'visible', timeout: 10000 });
      await expect(searchdesc).toBeEnabled({ timeout: 10000 });
      await searchdesc.click();
      const searchdesc2 = await page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await searchdesc2.click();
      await searchdesc2.fill(APPDESC.substring(0,3));
      await searchdesc2.press('Enter');
      console.log("APPDESC search with partial text");
    }
  /*if(APPDESC){
  await page.getByRole('button', { name: 'Open Search' }).click();
  await page.locator('#searchFieldInShell-select-arrow').click();  
  await page.getByRole('option', { name: 'Apps' }).click();
  const searchdesc = await page.getByRole('searchbox', { name: 'Search In: "Apps"' });
  await searchdesc.click();
  await searchdesc.fill(APPDESC.substring(0,3));
  await searchdesc.press('Enter');
  console.log("APPDESC search with partial text");
}
else{
  console.log("APPDESC doesn't search with partial text");
}  */
    
});
test.afterEach(async ({}, testInfo) => {
  const match = testInfo.title.match(/Fioritest\s+(\d+)/);
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
});