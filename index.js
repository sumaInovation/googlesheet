const { google } = require('googleapis');
const http = require('http');
const WebSocket = require('ws');
const express=require('express');
const App=express()
const server = require('http').createServer(App);
// Attach the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });
const dotenv = require('dotenv');
dotenv.config();
const PORT=process.env.PORT
const SHEET_ID =process.env.GOOGLE_SHEETS_ID;
const config={
    
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id":process.env.private_key_id ,
    "private_key":process.env.private_key ,
    "client_email":process.env.client_email,
    "client_id":process.env.client ,
    "auth_uri": process.env.auth_uri,
    "token_uri":process.env.token_uri ,
    "auth_provider_x509_cert_url":process.env.auth_provider_x509_cert_url ,
    "client_x509_cert_url":process.env.client_x509_cert_url ,
    "universe_domain":process.env.universe_domain
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials: config,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
   const sheets = google.sheets({ version: 'v4', auth })
    
  





// Event: When a client connects to the WebSocket server
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Event: When a message is received from a WebSocket client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Send a response back to the client
    ws.send(`Server received: ${message}`);
    
       // Share message all connected client
   wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }});
    if(message.toString()=="write"){
        WriteDataOnGoogleSheet()
    }
    if(message.toString()=="create"){
        CretaeNewSheet(); 
    }
    if(message.toString()=="read"){
        readSheet('Sheet1!A1:C3')
    }

      
  });

  // Event: When the WebSocket client disconnects
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server!');
});

// Start the server on port 8080
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server is running on http://localhost:${PORT}`);
});
//********************GOOGLE SHEET API PART */
//Write data
var Name,Email,Message
async function WriteDataOnGoogleSheet() {
Name="sumanga";
Email="None";
Message="Test1";
 
     // Write row(s) to spreadsheet
    sheets.spreadsheets.values.append({
    auth,
    spreadsheetId:SHEET_ID,
    range: "Sheet2!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[Name, Email,Message]],
    }})  
}


// Asynchronous function to read data from a Google Sheet.
async function readSheet(RANGE) {

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId:SHEET_ID, range:RANGE
        });
        const rows = response.data.values;  // Extracts the rows from the response.
        console.log(rows)
    } catch (error) {
        console.error('error', error);  // Logs errors.
    }
}



// Cretyae new sheet
async function CretaeNewSheet() {

const requests={
    spreadsheetId:SHEET_ID,
    requestBody: {
        requests: [
                  {
                    addSheet: {
                                properties: {
                                    title: 'JANUARY',
                                            }
                              }
                   }
                 ]
                }
             }

try {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.batchUpdate(requests, { auth:client });
    console.log('New sheet added');

} catch (error) {  
console.error('Error adding sheet:', error);

}  
                    
}
