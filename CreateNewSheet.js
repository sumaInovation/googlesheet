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
  const sheets = google.sheets("v4");

async function CreateNewSheet(SheetName) {
    const client = await auth.getClient();
      // ID of the Google Sheet


  try {
    // Create a new sheet
    const response = await sheets.spreadsheets.batchUpdate({
      auth: client,
      spreadsheetId:SHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: SheetName, // Name of the new sheet
              },
            },
          },
        ],
      },
    });
}catch{
    console.log("Error creating sheet");

}     
}

module.exports={CreateNewSheet}
          