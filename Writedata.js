const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();
const CREDENTIALS={
  type:process.env.type,
  project_id:process.env.project_id,
  private_key_id:process.env.private_key_i,
  private_key:process.env.private_key,
  client_email:process.env.client_email,
  client_id:process.env.client_id,
  auth_uri:process.env.auth_uri,
  token_uri:process.env.token_uri,
  auth_provider_x509_cert_url:process.env.auth_provider_x509_cert_url,
  client_x509_cert_url:process.env.client_x509_cert_url,
  universe_domain:process.env.universe_domain


}

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});






async function WriteDataOnGoogleSheet(data) {
  console.log('involked');
  var RANGE="Sheet1"
  const currentDate = new Date();
  // Get the full year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Get month (0-11) and pad with zero
    const day = String(currentDate.getDate()).padStart(2, '0');  // Pad day with zero if necessary
    // Format the date as YYYY/MM/DD
    const formattedDate = `${year}/${month}/${day}`;
     const {start,end,reason}=await data;
    
    const timeArray1 = start.split(':');
    const timeArray = end.split(':');
    const timediference=(parseInt(timeArray[0],10)*3600+parseInt(timeArray[1],10)*60+parseInt(timeArray[2],10))-(parseInt(timeArray1[0],10)*3600+parseInt(timeArray1[1],10)*60+parseInt(timeArray1[2],10))
     const   keys=[

        [
          formattedDate,
          start,
          end,
          timediference,
          reason
        ]
       ]
     

    
      
  const requestBody={
    values:keys
  }

    
        // Write row(s) to spreadsheet
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.append({
        auth,
        spreadsheetId:SHEET_ID,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        requestBody: requestBody,
      })
      
    }
    
    module.exports={WriteDataOnGoogleSheet}
