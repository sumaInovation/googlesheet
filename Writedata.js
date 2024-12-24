const dotenv = require('dotenv');
const { google } = require('googleapis');
const dayjs = require('dayjs');
dotenv.config();
const CREDENTIALS = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_i,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain


}

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});






async function WriteDataOnGoogleSheet(data) {
  console.log('involked');
  var RANGE = "Sheet1"
  const{start,end,reason}=data;
  const time1Obj1 = new Date(`1970-01-01T${start}Z`);
  const time1Ob2 = new Date(`1970-01-01T${end}Z`);
  const diffInSeconds = (time1Ob2 - time1Obj1) / 1000;

  const keys = [

    [
      new Date().toLocaleDateString(),
      start,
      end,
      diffInSeconds,
      reason
    ]
  ]

 const requestBody = {
    values: keys
  }


  // Write row(s) to spreadsheet
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.append({
    auth,
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: requestBody,
  })

}

module.exports = { WriteDataOnGoogleSheet }
