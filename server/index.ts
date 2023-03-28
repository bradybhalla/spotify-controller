import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ConnectionInfo, EntireQueue, PlayingSong, SingleQueue, Song, User } from "../shared_types";

import { searchSpotify } from "./spotifyApi";


/**
 * Which port to run the server on
 */
const port = 8080;

/**
 * Create the server
 */
const app = express();
app.use(express.json());



// REMOVE LATER
const cors = require('cors');
app.use(cors());




/**
 * Host the client
 */
app.use(express.static(__dirname + "/static"));


/**
 * Data
 */
// map socket id to user id
const users: Map<string, ConnectionInfo> = new Map();

// map user id to queue data
const queue: Map<string, SingleQueue> = new Map();

// order of users by user id
const order: string[] = [];

// current song information
const currentSong: PlayingSong | null = {
  song: {
    title: "New Slang",
    album: "Oh Inverted World",
    artist: "The Shins",
    songLink: "spotify.com/new_slang",
    imgLink: "https://i.scdn.co/image/ab67616d000048514205b816277c7f9dba098d28"
  },
  time: {
    current: 200,
    total: 300
  },
  paused: true,
  requester: {
    id: "10101",
    name: "Brady"
  }
};



/**
 * Sockets
 */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",     // GET RID OF THIS CORS STUFF LATER
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  /**
   * Manage API keys so only connected users can access this server's API
   */
  socket.on("user-info", (user: User) => {
    const newKey: string = `${Math.floor(Math.random() * 1e10)}`;
    
    const newUser: ConnectionInfo = {
      id: user.id,
      key: newKey
    };

    if (!queue.has(user.id)) {
      queue.set(user.id, { user: user, songs: [] });
      order.push(user.id);
    }
    users.set(socket.id, newUser);
    keys.add(newKey);
    socket.emit("api-key", { key: newKey });
  });
  
  socket.on("enqueue-song", (song: Song) => {
    const user = users.get(socket.id);
    if (user == null) {
      return;
    }

    const queueData = queue.get(user.id);
    if (queueData == null) { 
      return;
    }

    queueData.songs.push(song);

    io.emit("enqueue-song", {
      user: { id: queueData.user.id, name: queueData.user.name },
      song: song
    });
  });

  socket.on("modify-queue", (newSongs: Song[]) => {
    const user = users.get(socket.id);
    if (user == null) { 
      return; 
    }

    const queueData = queue.get(user.id);
    if (queueData == null) { 
      return; 
    }

    queueData.songs = newSongs;

    io.emit("modify-queue", {
      user: { id: queueData.user.id, name: queueData.user.name },
      songs: newSongs
    });
  });

  socket.on("disconnect", () => {
    const oldKey = users.get(socket.id)?.id;
    keys.delete(oldKey == undefined ? "" : oldKey);
    users.delete(socket.id);
  });


});


/**
 * API
 */
// set of api keys
const keys: Set<string> = new Set();

// search spotify
app.post("/api/search", (req, res) => {
  if (!keys.has(req.body.key)) {
    res.send(JSON.stringify([]));
    return;
  }

  searchSpotify(req.body.query, results => {
    // send type Song[]
    res.send(JSON.stringify(results));
  });
});

// get current song
app.post("/api/currentSong", (req, res) => {
  if (!keys.has(req.body.key)) {
    res.send(JSON.stringify({}));
    return;
  }

  // send type PlayingSong
  res.send(currentSong);
});

app.post("/api/queue", (req, res) => {
  console.log(req.body);
  if (!keys.has(req.body.key)) {
    res.send(JSON.stringify({}));
    return;
  }

  const currentQueue: EntireQueue = {
    data: Array.from(users, ([socketId, { id, key }]) => {
      const singleQueue = queue.get(id);
      return singleQueue == undefined ? { user: { name: "", id: "" }, songs: [] } : singleQueue;
    }),
    order: order
  };

  res.send(currentQueue);
});


/**
 * Start server
 */
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});