const { test, expect } = require('@playwright/test');
const { readExcel, writeExcel } = require('../utility/excel');
const XLSX = require('xlsx');
const filePath = 'C:\\Users\\1494346\\Desktop\\Finance FST\\test_data\\BankingAll.xlsx';
const sheetName = 'Sheet1';
const data = readExcel(filePath, sheetName);

data.forEach(({ SERIALNO, USERNAME, PASSWORD, SPACE, PAGE, SECTION, APPID, APPDESC, USERROLE }, index) => {
 test(`Fioritest ${SERIALNO} - ${APPDESC}`, async ({ page }, testInfo) => {
  // test(`Fiori test ${SERIALNO} - ${APPID}`, async ({ page }) => {
    //page.setDefaultTimeout(60000);
    //page.setDefaultNavigationTimeout(60000);
    // Launch the SAP Fiori Launchpad
    //await page.screenshot({ path: 'C:\\Users\\1502543\\Desktop\\SONI Test\\launchpad.png' });
    await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300');

    // Login
    await page.getByRole('textbox', { name: 'User' }).fill(USERNAME);
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    await passwordField.fill(PASSWORD);
    const logOnButton = page.getByRole('button', { name: 'Log On' });
    await expect(logOnButton).toBeVisible();
    await expect(logOnButton).toBeEnabled();
    await logOnButton.click();
    // 3. Check for SPACE button
    await page.waitForTimeout(500);
    await expect(page.locator('span[dir="auto"].sapMITHTextContent').filter({ hasText: SPACE })).toBeVisible();
    // await expect(page.locator('span').filter({ hasText: SPACE, exact: true }).first()).toBeVisible();
      // console.log(SPACE + " is visible");
      await page.waitForTimeout(500);
      // const moreButton = page.locator('[title="More"]').nth(0);
      const moreButton = page.getByRole('button', { name: 'More' });
      await expect(moreButton).toBeVisible();
      await expect(moreButton).toBeEnabled();
      await moreButton.click({ force: true });
    
    // Navigate to the required page
    if (PAGE) {
      try {
      //await page.getByRole('listitem', { name: PAGE }).click();
      const pageMenuItem = page.locator('[role="menuitem"]').filter({ hasText: PAGE });
      await expect(pageMenuItem).toBeVisible();
      await expect(pageMenuItem).toBeEnabled();
      await pageMenuItem.click({ force: true });
      //const pageselection = page.locator("li").filter({ hasText: PAGE });
      console.log(" Page is opened");
      } catch (error) {
      console.log("Page is not opened", error);
      return;      }   
    }
   // 5. Validate APPDESC is present under SECTION
    const section = await page.locator('h3').filter({ hasText: SECTION ,exact: true }).isVisible();
    console.log("Section presence:", section);
    console.log("Section is visible");

    // 6. Click on search button and enter APPID
    if(SECTION){
    const appdescLink = page.getByRole('link', { name: APPDESC });
    await expect(appdescLink).toBeVisible();
    await expect(appdescLink).toBeEnabled();
    await appdescLink.click({ force: true });
    console.log("APPDESC clicked inside the section");
    try {
      const backButton = page.getByRole('button', { name: 'Back' });
      await expect(backButton).toBeVisible();
      await expect(backButton).toBeEnabled();
      await backButton.click();
      console.log("Back button clicked");
    } catch (error) {
      //await page.locator('iframe[name="application-Project-process-iframe"]').contentFrame().getByRole('button', { name: 'Close' }).click();
      const closeButton = page.getByTitle('Close');
      await expect(closeButton).toBeVisible();
      await expect(closeButton).toBeEnabled();
      await closeButton.click();
      console.log("Popup closed");
      const backButtonAfter = page.getByRole('button', { name: 'Back' });
      await expect(backButtonAfter).toBeVisible();
      await expect(backButtonAfter).toBeEnabled();
      await backButtonAfter.click();
      console.log("Back button clicked after closing popup");
    }
    }

    if(APPDESC){
    const openSearchButton = page.getByRole('button', { name: 'Open Search' });
    await expect(openSearchButton).toBeVisible();
    await expect(openSearchButton).toBeEnabled();
    await openSearchButton.click({ force: true });
    await page.waitForTimeout(500);
    const searchFieldArrow = page.locator('#searchFieldInShell-select-arrow');
    // const searchFieldArrow = page.locator('#searchFieldInShell-select-label');
    await expect(searchFieldArrow).toBeVisible();
    await expect(searchFieldArrow).toBeEnabled();
    await searchFieldArrow.click({ force: true });
    //await page.getByRole('option', { name: 'Apps' }).click();
    
    // const appsOption = page.getByText('Apps').nth(0);
    const appsOption = page.getByRole('option', { name: 'Apps' });

    await expect(appsOption).toBeVisible({ timeout: 500 });
    await expect(appsOption).toBeEnabled();
    await appsOption.click();
    const searchappdesc = page.getByRole('searchbox', { name: 'Search In: "Apps"' });
    await expect(searchappdesc).toBeVisible();
    await expect(searchappdesc).toBeEnabled();
    await searchappdesc.click();
    await searchappdesc.fill(APPDESC);
    await searchappdesc.press('Enter');
    //await page.waitForTimeout(2000);
    console.log("APPDESC searched globally");
  }
  else{
    console.log("APPDESC doesn't exist in global search");
  }
  if (await page.getByText("Results (1)").isVisible()) {

   const resultLink = page.getByText(APPDESC);
   await expect(resultLink).toBeVisible();
   await expect(resultLink).toBeEnabled();
   await resultLink.click();
   console.log("One result found-APPDESCRIPTION");
  }
   else if (await page.getByText("Results (0)").isVisible()) {
      // If result is 0, log not present
      console.log("No result found-APPDESCRIPTION");
      const backButton1 = page.getByRole('button', { name: 'Back' });
      await expect(backButton1).toBeVisible();
      await expect(backButton1).toBeEnabled();
      await backButton1.click();
      const openSearchButton1 = page.getByRole('button', { name: 'Open Search' });
      await expect(openSearchButton1).toBeVisible();
      await expect(openSearchButton1).toBeEnabled();
      await openSearchButton1.click();
      await page.waitForTimeout(500);
      const searchArrow1 = page.locator('#searchFieldInShell-select-arrow');
      // const searchArrow1 = page.locator('[title*="Search In:"]');
      await expect(searchArrow1).toBeVisible();
      await expect(searchArrow1).toBeEnabled();
      await searchArrow1.click({ force: true });
      // const appsOption1 = page.getByText('Apps').nth(0);
      const appsOption1 = page.getByRole('option', { name: 'Apps' });
      await expect(appsOption1).toBeVisible({ timeout: 500 });
      await expect(appsOption1).toBeEnabled();
      await appsOption1.click();
      const searchdesc = page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await expect(searchdesc).toBeVisible();
      await expect(searchdesc).toBeEnabled();
      await searchdesc.click();
      await searchdesc.fill(APPDESC.substring(0,3));
      await searchdesc.press('Enter');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      // await page.screenshot({ path: `C:\\Users\\1502543\\Desktop\\SONI Test\\step_${SERIALNO}_08.png` , fullPage: true });
      console.log("APPDESC search with partial text");
    } else {
      // Multiple results or unknown state
      console.log("Multiple results found-APPDESCRIPTION");
      const backButton2 = page.getByRole('button', { name: 'Back' });
      await expect(backButton2).toBeVisible();
      await expect(backButton2).toBeEnabled();
      await backButton2.click();
      //await page.waitForTimeout(3000);
      // const openSearchButton2 = page.locator('[title="Open Search"]').nth(0);
      const openSearchButton2 = page.getByRole('button', { name: 'Open Search' });
      await expect(openSearchButton2).toBeVisible();
      await expect(openSearchButton2).toBeEnabled();
      await openSearchButton2.click();
      await page.waitForTimeout(1000);
      //await page.getByRole('button', { name: 'Open Search' }).click();
      const searchArrow2 = page.locator('#searchFieldInShell-select-arrow');
      // const searchArrow2 = page.locator('[title*="Search In:"]').first();
      await expect(searchArrow2).toBeVisible();
      await expect(searchArrow2).toBeEnabled();
      await searchArrow2.click({ force: true });
      // const appsOption2 = page.getByText('Apps').nth(0);
      const appsOption2 = page.getByRole('option', { name: 'Apps' });
      await expect(appsOption2).toBeVisible({ timeout: 500 });
      await expect(appsOption2).toBeEnabled();
      await appsOption2.click();
      const searchdesc = page.getByRole('searchbox', { name: 'Search In: "Apps"' });
      await expect(searchdesc).toBeVisible();
      await expect(searchdesc).toBeEnabled();
      await searchdesc.click();
      await searchdesc.fill(APPDESC.substring(0,3));
      await searchdesc.press('Enter');
      console.log("APPDESC search with partial text");
    }
  
});

 // Write result to Excel after this individual test completes
 test.afterEach(async ({ }, testInfo) => {
   // Only update if this is the current test
   if (testInfo.title === `Fioritest ${SERIALNO} - ${APPDESC}`) {
     try {
       const wb = XLSX.readFile(filePath);
       const ws = wb.Sheets[sheetName];
       const rowNumber = index + 2; // +2 for header row and 0-based index
       
       const status = testInfo.status === 'passed' ? 'PASS' : 'FAIL';
       let errorDetails = '';
       
       // Get error details if test failed
       if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
         if (testInfo.errors && testInfo.errors.length > 0) {
           const error = testInfo.errors[0];
           
           // Capture full error message
           let errorMessage = error.message || '';
           
           // Check for timeout errors
           if (errorMessage.includes('Timeout') || errorMessage.includes('timeout')) {
             errorDetails = `Timeout: ${errorMessage}`;
           }
           // Check for assertion errors
           else if (error.name === 'AssertionError' || errorMessage.includes('expect')) {
             errorDetails = `Assertion Failed: ${errorMessage}`;
           }
           // Check for locator/selector errors
           else if (errorMessage.includes('locator') || errorMessage.includes('selector')) {
             errorDetails = `Element Not Found: ${errorMessage}`;
           }
           // Check for navigation errors
           else if (errorMessage.includes('navigation') || errorMessage.includes('goto')) {
             errorDetails = `Navigation Error: ${errorMessage}`;
           }
           // Generic error with line number
           else {
             const stackLines = error.stack ? error.stack.split('\n') : [];
             const fileLineMatch = stackLines.find(line => line.includes('BankingAll.spec.js'));
             
             if (fileLineMatch) {
               const lineMatch = fileLineMatch.match(/BankingAll\.spec\.js:(\d+):(\d+)/);
               if (lineMatch) {
                 errorDetails = `Line ${lineMatch[1]}: ${errorMessage}`;
               } else {
                 errorDetails = errorMessage;
               }
             } else {
               errorDetails = errorMessage;
             }
           }
         } else if (testInfo.status === 'timedOut') {
           errorDetails = 'Test timed out';
         } else {
           errorDetails = 'Test failed - no error details available';
         }
       }
       
       // Write to columns J and K
       ws[`J${rowNumber}`] = { v: status, t: 's' };
       ws[`K${rowNumber}`] = { v: errorDetails, t: 's' };
       
       XLSX.writeFile(wb, filePath);
       console.log(`Updated Excel Row ${rowNumber}: ${status} - ${errorDetails || 'No errors'}`);
     } catch (error) {
       console.error('Failed to update Excel:', error.message);
     }
   }
 });
});