import express from "express";
import http from "http";
import {Server} from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

let port = 8080;

app.use(express.static(__dirname + "/static"));

app.get("/api", (req, res) => {
  res.send("ITS THE API");
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});