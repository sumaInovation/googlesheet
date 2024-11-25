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
  var RANGE="Sheet1"
  const currentDate = new Date();
  // Get the full year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Get month (0-11) and pad with zero
    const day = String(currentDate.getDate()).padStart(2, '0');  // Pad day with zero if necessary
    // Format the date as YYYY/MM/DD
    const formattedDate = `${year}/${month}/${day}`;
     const {start,end,breake_value,run_value}=await data;
     var keys=[];
     if(breake_value!=undefined){
      RANGE="Sheet2"
      keys=[

        [
          formattedDate,
          start,
          end,
          breake_value
        ]
       ]
     }

     if(run_value!=undefined){
      RANGE="Sheet1"
      keys=[

        [
          formattedDate,
          start,
          end,
          run_value
        ]
       ]
     }
      
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
    
    