const { google } = require('googleapis');
const dotenv = require('dotenv');
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


async function FetchData(RANGE) {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
  
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId:SHEET_ID,
        range: RANGE,
      });
  
      const rows = res.data.values;
      return rows
    } catch (err) {
      console.error('The API returned an error: ' + err);
    }
  }
  
  module.exports={FetchData}