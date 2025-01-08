
// const express = require('express');
// const cookieParser = require("cookie-parser");
// const http = require('http');
// const WebSocket = require('ws');
// const cors = require('cors');
// const helmet = require('helmet');
// const { WriteDataOnGoogleSheet } = require('./Googlesheet/Writedata');
// const { FetchData } = require('./Googlesheet/Fetchdatas');
// const bodyparser = require('body-parser');
// const User =require('./Routes/User')
// const session =require('express-session')

// const PORT = 5000;  
// // Create an Express app
// const app = express();
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Opti
// app.use(bodyparser.json());

// // app.use((req, res, next) => {
// //   // Add COOP and COEP headers to the response
// //   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // or 'unsafe-none' if you need less strict policy
// //   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // or 'unsafe-none' if you need less strict policy

// //   next();
// // });

// // // Configure CORS
// // app.use(cors({
// //  // origin: "http://localhost:3000", // Your frontend's origin
// //   origin: ["http://localhost:3000","https://pptinovation.vercel.app"], // Your frontend's origin
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// //   credentials: true, // Allow cookies or Authorization headers
// // }));
// app.use('/user',User);

  
// const server = http.createServer(app);

// // Create a WebSocket server attached to the HTTP server
// const wss = new WebSocket.Server({ server });

// // Keep track of connected clients
// let clients = [];
// // WebSocket connection handler
// wss.on('connection', async (ws) => {
//   console.log('A new client connected,Total no of Clients', wss.clients.size);
//   clients.push(ws);

//   // Listen for messages from the client
//   ws.on('message', async (message) => {
//     try {
//       const dataFromClient = JSON.stringify(message.toString());
//       const { reason } = JSON.parse(JSON.parse(dataFromClient));
//       //Updates Googlesheet when Any state change
//       if (reason != undefined) {
//         WriteDataOnGoogleSheet(JSON.parse(JSON.parse(dataFromClient)))
//       }


//       wss.clients.forEach((client) => {
//         // Exclude the client that sent the message (skip the sender)
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(dataFromClient);

//         }
//         //  console.log(message.toString())
//       })

//     } catch (e) {
//       console.log("Error :", e);
//     }


//   });
//   // Handle client disconnection
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// app.get('/distributedata',async(req,res)=>{
//   try{
//      const data=await FetchData("sheet1");
     
//      const fileterdata=data.filter(item=>{
//       if(new Date(item[0]).toLocaleDateString()==new Date().toLocaleDateString())return item

//      })
    
//      res.json(fileterdata);
//   }catch(error){
//     console.log(error);
//     res.json("Error Data Ocurs");
//   }
  
// })
// app.get('/userdata',async(req,res) => {
  
// try{
//   const data=await FetchData("Sheet1");
//   res.json(data);

// }catch(error){
//   console.error(error);
//   res.json(error)
// }

// })


// // Enable JSON parsing
// app.use(express.json());
// app.use(cors({
//   origin:"http://localhost:5001"
// }))
// const colors=[
//   {
//   "color": "red",
//   "value": "#f00"
//   },
//   {
//   "color": "green",
//   "value": "#0f0"
//   },
//   {
//   "color": "blue",
//   "value": "#00f"
//   },
//   {
//   "color": "cyan",
//   "value": "#0ff"
//   },
//   {
//   "color": "magenta",
//   "value": "#f0f"
//   },
//   {
//   "color": "yellow",
//   "value": "#ff0"
//   },
//   {
//   "color": "black",
//   "value": "#000"
//   }
//   ]
// app.get('/',(req,res)=>{
//   console.log(colors)
//   res.send('Welcome to NodeJS + Express CORS Server! 🎈')
//   })
//   app.get('/colors',(req,res)=>{
//     res.set('Access-Control-Allow-Origin', '*');
//     res.json(colors)
//     })



// // Start the HTTP server on port 3000
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express();
const cors = require('cors');
const SECRET_KEY="sum@345mm"
app.use(cors({ origin: 'https://pptinovation.vercel.app', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
	res
		.status(202)
		.cookie('oldname', 'sumanga', {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().getTime() + 100 * 1000),
            httpOnly: true,
		}).send("cookie being initialised")
});
app.get('/deleteCookie', (req, res) => {
	res
		.status(202)
		.clearCookie('Name').send("cookies cleared")
});

app.post('/login',(req,res)=>{
const {name,email,picture}=req.body
const payload={
  Name:name,
  Email:email,
  Picture:picture
}
 // Sign the token with the payload and secret key, with an expiration time
 const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

res
		.status(202)
		.cookie('token', token, {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().getTime() + 100 * 1000),
            httpOnly: true,
		}).send("Token has been sent!")

})

app.get('/profile',(req,res)=>{
  const cookievalue=req.cookies('token')(cookievalue)
res.json(cookievalue)
})
app.listen(5000,()=>console.log('sever is running on port:5000'));



