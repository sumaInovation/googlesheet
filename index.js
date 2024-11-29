// server.js
/*
start
end
run_value
breake_value
current_running_time
current_breaking_time


*/
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Gettodaydata } = require('./Gettodaydata');
const { FetchData } = require('./Fetchdatas');
const PORT = 5000;
// Create an Express app
const app = express();

// Create an HTTP server and attach it to the Express app
const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Keep track of connected clients
let clients = [];
// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('A new client connected,Total no of Clients', wss.clients.size);
  clients.push(ws);
  // Send a welcome message to jus now connected the client
  ws.send('Welcome to the WebSocket server!');

  // Listen for messages from the client
  ws.on('message', async (message) => {

    let databuffer;
    try {
      const incomming_message = JSON.parse(message);

      const raw = {
        start,
        end,
        run_value,
        breake_value,
        current_running_time,
        current_breaking_time
      } = incomming_message;
const {t}=incomming_message;
      try {
        //Decide what to do ?
        databuffer = { ...raw };


        if (run_value != undefined || breake_value != undefined) {
          console.log(databuffer);
          //Update runtime on google sheet and get today runtime and brokent time and aloso moth value
          // WriteDataOnGoogleSheet(message);
          const todayTotalRun = await Gettodaydata("Sheet1");
          const todatTotalBreake = await Gettodaydata("Sheet2");
          const sum1 = await FetchData("Sheet1");
          thismontTotalRun = sumValues(sum1);
          const sum2 = await FetchData("Sheet2");
          const thismontTotalBreake = sumValues(sum2)
          console.log(thismontTotalBreake);
          console.log(thismontTotalRun);
          databuffer = { ...raw,todatTotalBreake,todayTotalRun,thismontTotalBreake,thismontTotalRun };
        
        }
        //Make Data to transmission form
        const processData = JSON.stringify(databuffer);

        // Broadcast the message to all other clients except the sender
        wss.clients.forEach((client) => {
          // Exclude the client that sent the message (skip the sender)
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(processData);

          }
        });
      } catch {


      }



    } catch (error) {
      console.log(error);
    }


  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the HTTP server on port 3000
server.listen(PORT, () => {
  console.log('Server running at http://localhost:3000');
});



function sumValues(data) {
  let totalSum = 0;

  // Iterate through the array and sum the values in the last column (index 3)
  data.forEach(row => {
    // Convert the value from string to integer and add to the total sum
    const value = parseInt(row[3], 10);
    if (!isNaN(value)) {
      totalSum += value;
    }
  });

  return totalSum;
}