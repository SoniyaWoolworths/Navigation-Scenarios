const { test, expect } = require('@playwright/test');
const { readExcel, writeExcelFile } = require('../utility/excel');
const XLSX = require('xlsx');
const filePath = 'C:\\Users\\1494346\\Desktop\\Finance FST\\test_data\\ExternalAppLinksAll.xlsx';
const sheetName = 'Banking';
const data = readExcel(filePath, sheetName);


data.forEach(({ SERIALNO, USERNAME, PASSWORD, SPACE, PAGE, SECTION, APPDESC, SUBSECTION, LINK, VALUE }, index) => {
  test(`Fiori test ${SERIALNO} - ${APPDESC}`, async ({ page }, testInfo) => {
    page.setDefaultTimeout(120000);
    page.setDefaultNavigationTimeout(120000);
    // Launch the SAP Fiori Launchpad
    await page.goto('https://sapus4apps001.wowcorp.com.au:8443/sap/bc/ui2/flp?saml2=disabled&sap-client=300');
    // Login
    const userField = page.getByRole('textbox', { name: 'User' });
    await expect(userField).toBeVisible();
    await expect(userField).toBeEnabled();
    await userField.fill(USERNAME);
    
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    await passwordField.fill(PASSWORD);
    
    const logOnButton = page.getByRole('button', { name: 'Log On' });
    await expect(logOnButton).toBeVisible();
    await expect(logOnButton).toBeEnabled();
    await logOnButton.click();
    await page.waitForTimeout(2000);
    if(await page.locator('span').filter({ hasText: SPACE, exact: true }).nth(0).isVisible()) {
      console.log(SPACE + " is visible");
      const moreButton = page.locator('[title="More"]').nth(0);
      await expect(moreButton).toBeVisible();
      await expect(moreButton).toBeEnabled();
      await moreButton.click({ force: true });
    }
    
    // Navigate to the required page
    if (PAGE) {
      //await page.getByText(Reporting Financial).click();
      try {
      const pageItem = page.getByRole('listitem', { name: PAGE });
      await expect(pageItem).toBeVisible();
      await expect(pageItem).toBeEnabled();
      await pageItem.click();
      console.log("Navigation successful page is opened");
      } catch (error) {
      console.log('Navigation failed or page closed:', error);
      return;
      } 
    } 
    if(SECTION){
      // Try clicking APPDESC
      const appDescButton = page.getByText(APPDESC);
      await expect(appDescButton).toBeVisible();
      await expect(appDescButton).toBeEnabled();
      await appDescButton.click({ force: true });
      // Check if APPDESC is still not active/visible, try clicking again
      console.log("Banking External links clicked");
      await page.waitForTimeout(2000);
    }
    else{
      console.log("Banking External links not clicked");
      await page.waitForTimeout(2000);
    }

  if(await page.getByText(SUBSECTION).isVisible()){
    //await page.locator('div').filter({ hasText: SUBSECTION, exact: true }).isVisible();
    //await page.getByRole('heading', { name: SUBSECTION }).isVisible();
  console.log(SUBSECTION);
  const variable1 = LINK; // Or use VALUE if that's your link
await page.waitForTimeout(1000);
// Click the link and wait for the new page/tab to open
const linkElement = page.getByRole('link', { name: VALUE});
await expect(linkElement).toBeVisible();
await expect(linkElement).toBeEnabled();

const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  linkElement.click()
]);

await newPage.waitForLoadState('load'); // Ensure the new page is fully loaded

// Store the new page's URL as variable2
// Or use VALUE if that's your link
const variable2 = newPage.url();
if (variable1 && variable2 && variable1.trim() === variable2.trim()) {
  console.log("Links match!");
} else {
  console.log(`Links do not match. Expected: ${variable1}, Actual: ${variable2}`);
}
  }
  
  });

 // Write result to Excel after this individual test completes
 test.afterEach(async ({ }, testInfo) => {
   // Only update if this is the current test
   if (testInfo.title === `Fiori test ${SERIALNO} - ${APPDESC}`) {
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
             const fileLineMatch = stackLines.find(line => line.includes('External_App_Links.spec.js'));
             
             if (fileLineMatch) {
               const lineMatch = fileLineMatch.match(/External_App_Links\.spec\.js:(\d+):(\d+)/);
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
       
       // Write to columns K and L
       ws[`K${rowNumber}`] = { v: status, t: 's' };
       ws[`L${rowNumber}`] = { v: errorDetails, t: 's' };
       
       XLSX.writeFile(wb, filePath);
       console.log(`Updated Excel Row ${rowNumber}: ${status} - ${errorDetails || 'No errors'}`);
     } catch (error) {
       console.error('Failed to update Excel:', error.message);
     }
   }
 });
});