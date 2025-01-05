// Import the 'ws' library
const WebSocket = require('ws');

// Create a WebSocket server and bind it to port 8080
const wss = new WebSocket.Server({ port: 8080 });

// This will run when a new client connects to the WebSocket server
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send a message to the client when they connect
  ws.send('Welcome to the WebSocket server!');
  
  // Set up an event listener for messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Respond to the client with the same message (echo)
    ws.send(`You said: ${message}`);
  });

  // Event listener for when the client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
