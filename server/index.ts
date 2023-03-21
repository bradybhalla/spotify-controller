import express from "express";
import http from "http";
import { Server } from "socket.io";

import "./spotifyApi";

/**
 * Which port to run the server on
 */
const port = 8080;

/**
 * Create the server
 */
const app = express();
const server = http.createServer(app);

/**
 * Initialize socket.io on the server
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",     // GET RID OF THIS CORS STUFF LATER
    methods: ["GET", "POST"]
  }
});

/**
 * Host the client
 */
app.use(express.static(__dirname + "/static"));

/**
 * API
 */
const keys: Map<string, string> = new Map();

app.post("/api", (req, res) => {
  res.send("ITS THE API");
  console.log(req.body);
  res.send(JSON.stringify({ status: "ok" }));
});

/**
 * Sockets
 */
io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  

  const newKey = `${Math.floor(Math.random() * 1e10)}`;
  keys.set(socket.id, newKey);
  socket.emit("api-key", newKey);


  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    keys.delete(socket.id);
  });

});



/**
 * Start server
 */
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});