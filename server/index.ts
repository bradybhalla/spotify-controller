import express from "express";
import http from "http";
import { Server } from "socket.io";
import { stringify } from "qs";
import readline from "readline";
import {existsSync, readFileSync} from "fs";

import { ConnectionInfo, EntireQueue, PlayingSong, SingleQueue, Song, User } from "../shared_types";

import { changeSong, getCurrSong, getKey, getTracksInfo, refreshKey, searchSpotify, setAuth } from "./spotifyApi";

/**
 * Get needed authentication data
 */

if (!existsSync(__dirname + "/auth.json")){
  console.log("Run \"npm run authenticate\" first");
  process.exit();
} else {
  const authData = JSON.parse(readFileSync(__dirname + "/auth.json").toString())
  setAuth(authData.basic, authData.redirect);
}

/**
 * Which port to run the server on
 */
const port = 8080;

/**
 * Create the server
 */
const app = express();
app.use(express.json());


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
let currentSong: PlayingSong | null = null;
let currentSongUpdatedTimestamp: number = Date.now();
let currentSongChanging: boolean = false;

function nextUri() {
  if (order.length == 0) {
    return "spotify:track:1301WleyT98MSxVHPZCA6M";
  }
  let currId = currentSong?.requester.id;
  if (currId == undefined || currId == "") {
    currId = order[0];
  }
  const currIdIndex = order.indexOf(currId);

  let nextId: string | null = null;
  for (let i = 1; i <= order.length; i++) {
    let index = (currIdIndex + i) % order.length;
    if (queue.get(order[index])!.songs.length > 0) {
      nextId = order[index];
      break;
    }
  }

  if (nextId == null) {
    return "spotify:track:1301WleyT98MSxVHPZCA6M";
  }

  const nextSong = queue.get(nextId)!.songs.splice(0, 1)[0];
  if (currentSong != null) {
    currentSong.requester = queue.get(nextId)!.user;
  }
  io.emit("modify-queue", queue.get(nextId));


  return nextSong.uri;
}



/**
 * Sockets
 */
const server = http.createServer(app);

const io = new Server(server);

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
      socket.broadcast.emit("new-user", { user: user, order: order, songs: [] });
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

app.post("/api/idsInfo", (req, res) => {
  if (!keys.has(req.body.key)) {
    res.send(JSON.stringify([]));
    return;
  }

  getTracksInfo(req.body.ids, results => {
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
  if (!keys.has(req.body.key)) {
    res.send(JSON.stringify({}));
    return;
  }

  const currentQueue: EntireQueue = {
    data: Array.from(queue, ([userId, singleQueue]) => singleQueue),
    order: order
  };

  res.send(currentQueue);

});

/**
 * Login to spotify
 */
let nextRefreshEvent: NodeJS.Timeout | null = null;

app.get("/login", (req, res) => {
  const scope = "user-read-playback-state user-modify-playback-state";
  const url = "https://accounts.spotify.com/authorize?" + stringify({
    response_type: "code",
    client_id: "c05ca5be997a4566afcfebca1253b8bd",
    scope: scope,
    redirect_uri: "http://localhost:8080/authorize"
  });
  res.redirect(url);
});

function setRefreshTimeout(expiresIn: number) {
  if (nextRefreshEvent != null) {
    clearTimeout(nextRefreshEvent);
  }
  nextRefreshEvent = setTimeout(() => {
    refreshKey(expiresIn2 => {
      setRefreshTimeout(expiresIn2);
    });
  }, expiresIn * 900);
}

app.get("/authorize", (req, res) => {
  getKey(req.query.code as string, setRefreshTimeout);
  process.stdout.write("\r\x1b[K");

  res.redirect("/");
});


/**
 * Background tasks
 */

// keep current song up to date
setInterval(() => getCurrSong(currentSong, song => {
  if (!currentSongChanging) {
    currentSong = song;
    currentSongUpdatedTimestamp = Date.now();
    io.emit("change-playing-song", currentSong);
  }
}), 2000);


setInterval(() => {
  if (currentSong == null) {
    return;
  }
  if (!currentSong.paused && !currentSongChanging && currentSong.time.current + (Date.now() - currentSongUpdatedTimestamp) / 1000 + 1 > currentSong.time.total) {
    currentSongChanging = true;
    changeSong(nextUri(), () => {
      getCurrSong(currentSong, song => {
        currentSong = song;
        currentSongUpdatedTimestamp = Date.now();
        io.emit("change-playing-song", currentSong);
        currentSongChanging = false;
      }, () => {
        currentSongChanging = false;
      });

    }, () => {
      currentSongChanging = false;
    });
  }
}, 100);

/**
 * Start server
 */
server.listen(port, () => {
  console.log(`Client: http://localhost:${port}`);
  console.log("Controls:\n\t- Fast forward: f\n");
  process.stdout.write(`Login needed (http://localhost:${port}/login)`)
});

/**
 * Handle input
 */

readline.emitKeypressEvents(process.stdin);

if (process.stdin.setRawMode != null) {
  process.stdin.setRawMode(true);
}

process.stdin.on("keypress", (str, key) => {
  if (key.sequence == "\x03"){
    process.exit();
  } else if (key.sequence == "f"){
    currentSongChanging = true;
    changeSong(nextUri(), () => {
      getCurrSong(currentSong, song => {
        currentSong = song;
        currentSongUpdatedTimestamp = Date.now();
        io.emit("change-playing-song", currentSong);
        currentSongChanging = false;
        process.stdout.write("fast forward")
        setTimeout(()=>process.stdout.write("\r\x1b[K"), 1000);
      }, () => {
        currentSongChanging = false;
      });

    }, () => {
      currentSongChanging = false;
    });
  }
})

