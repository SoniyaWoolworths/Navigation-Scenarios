const XLSX = require('xlsx');

function readExcelFile(filePath, sheetName) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}

// Updated: write to a specific column (e.g., 'J' or 'K') and value
function writeExcelFile(filePath, sheetName, rowNumber, column, value) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    sheet[`${column}${rowNumber}`] = { t: 's', v: value };
    XLSX.writeFile(workbook, filePath);
}

module.exports = { readExcelFile, writeExcelFile };