 const { google } = require('googleapis');


 // =SORT(ethfsvzoM!A1:Z, 1, true)
async function appendDataToSheet(sheets, spreadsheetId, sheetTitle, headers, values) {
  try {
    const sheetMeta = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges: [],
      includeGridData: false,
    });

    let sheetId = null; // Initialize sheetId

    // Check if the sheet exists and get its ID if it does
    const sheetExists = sheetMeta.data.sheets.some(sheet => {
      if (sheet.properties.title === sheetTitle) {
        sheetId = sheet.properties.sheetId;
        return true;
      }
      return false;
    });

    if (!sheetExists) {
      // Create new sheet and get its ID
      const response = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                },
              },
            },
          ],
        },
      });
      sheetId = response.data.replies[0].addSheet.properties.sheetId;

      // Freeze the first row and column
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheetId,
                  gridProperties: {
                    frozenRowCount: 1,
                    frozenColumnCount: 1,
                  },
                },
                fields: 'gridProperties(frozenRowCount,frozenColumnCount)',
              },
            },
          ],
        },
      });

      // Append headers to the new sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetTitle}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: headers },
      });
    }

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: values },
    });

    console.log('Data appended successfully to sheet:', sheetTitle);
  } catch (error) {
    console.error('Error in appendDataToSheet', error.message, error.stack);
  }
}


async function appendAllDataFromJson_big(auth, spreadsheetId, sheetTitle, jsonData) {
  const sheets = google.sheets({ version: 'v4', auth });
  
  // Extract headers directly from jsonData[0]
  const headers = [jsonData[0]];
  console.log('jsonData', jsonData);
  console.log('headers', headers);

  // Extract values starting from jsonData[1]
  let formattedValues = jsonData.slice(1).map(item => 
    item.map(value => 
      typeof value === 'string' && value.match(/^[0-9\.]+e\+[0-9]+$/i) ? parseFloat(value) : value
    )
  );
  console.log('formattedValues', formattedValues);

  await appendDataToSheet(sheets, spreadsheetId, sheetTitle, headers, formattedValues);
}



async function appendAllDataFromJson(auth, spreadsheetId, sheetTitle, jsonData) {
  const sheets = google.sheets({ version: 'v4', auth });
  const headers = [Object.keys(jsonData[0])];
  const formattedValues = jsonData.map(item => 
    Object.values(item).map(value => 
      typeof value === 'string' && value.match(/^[0-9\.]+e\+[0-9]+$/i) ? parseFloat(value) : value
    )
  );

  await appendDataToSheet(sheets, spreadsheetId, sheetTitle, headers, formattedValues);
}

async function appendSelectedData(auth, spreadsheetId, sheetTitle, jsonData, selectedFields) {
  const sheets = google.sheets({ version: 'v4', auth });
  const headers = [selectedFields];
  const formattedValues = jsonData.map(item => 
    selectedFields.map(field => 
      typeof item[field] === 'string' && item[field].match(/^[0-9\.]+e\+[0-9]+$/i) ? parseFloat(item[field]) : item[field]
    )
  );

  await appendDataToSheet(sheets, spreadsheetId, sheetTitle, headers, formattedValues);
}

async function appendTimeAndPositionData(auth, spreadsheetId, sheetTitle, jsonData) {
  const sheets = google.sheets({ version: 'v4', auth });
  const headers = [['unix', 'time', 'position' , 'Close Price']];
  const formattedValues = jsonData.map(item => {
    // Ensure to replace '$time' and 'position' with the correct keys from your JSON data
    const time = new Date(item['$time'] * 1000).toLocaleString();
    const unix =(item['$time']);
    return [unix ,time, item['position'] ,item['ClosePrice'] ];
  });

  await appendDataToSheet(sheets, spreadsheetId, sheetTitle, headers, formattedValues);
}

module.exports = {
  appendAllDataFromJson,
  appendDataToSheet,
  appendSelectedData,
  appendTimeAndPositionData,  // Export the new function
  appendAllDataFromJson_big
};
