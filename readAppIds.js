const fs = require('fs');
const parse = require('csv-parse/sync');

// Reads AppIDs from a CSV file and returns them as an array
function getAppIds(csvPath) {
  const fileContent = fs.readFileSync(csvPath);
  const records = parse.parse(fileContent, { columns: true });
  // Replace 'AppID' with your actual column name
  return records.map(row => row.AppID);
}

// Example usage:
const appIds = getAppIds('appids.csv');
console.log(appIds);

module.exports = { getAppIds };
