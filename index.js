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
const PORT=process.env.PORT
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
var Name,Email,Message
const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function WriteDataOnGoogleSheet() {
Name="Jaami";
Email="None";
Message="Test1";
    // Write row(s) to spreadsheet
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.append({
    auth,
    spreadsheetId:SHEET_ID,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[Name, Email,Message]],
    }})
}

//accessGoogleSheet();



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
    WriteDataOnGoogleSheet();
    
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


// Read Data From Sheet
async function GetData(RANGE) {
  const rows=await FetchData(RANGE);
  if (rows.length) {
    console.log('Data from the sheet:');
    rows.forEach((row) => {
      console.log(row);
    });
  } else {
    console.log('No data found.');
  }
}
async function SerchData(SEARCH_TERM,RANGE) {
  const rows=await FetchData(RANGE);
  if (rows.length) {
    // Search for the term in the rows
    const foundRows = rows.filter((row) => row.some((cell) => cell && cell.toLowerCase().includes(SEARCH_TERM.toLowerCase())));

     if (foundRows.length) {
      console.log('Found matching rows:');
      foundRows.forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row);
      });
    } else {
       console.log('No matching data found.');
    }
  } else {
    console.log('No data found.');
  }


}
App.get('/',(req,res)=>{
res.send("hello world");

  
});
