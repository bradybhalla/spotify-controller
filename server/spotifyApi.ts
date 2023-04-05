import axios from "axios";
import { stringify } from "qs";

import { PlayingSong, Song, User } from "../shared_types";

const VERBOSE: boolean = false;

let key = "";
let refresh_token = "";
let basic_auth = "";
let redirect_uri = "";

export function setAuth(_basic_auth: string, _redirect_uri: string){
  basic_auth = _basic_auth;
  redirect_uri = _redirect_uri;
}

export function refreshKey(callback: (expiresIn: number) => void) {
  axios.post("https://accounts.spotify.com/api/token", {
    grant_type: "refresh_token",
    refresh_token: refresh_token
  }, {
    headers: {
      "Authorization": `Basic ${basic_auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(res => {
    if (VERBOSE) {
      console.log("Refreshed access token");
    }
    key = res.data.access_token;
    callback(res.data.expires_in);
  }).catch(err => {
    if (VERBOSE) {
      console.log("(Failed) to refreshed access token");
    }
  });
}

export function getKey(code: string, callback: (expiresIn: number) => void) {
  axios.post("https://accounts.spotify.com/api/token", {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri
  }, {
    headers: {
      "Authorization": `Basic ${basic_auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(res => {
    if (VERBOSE) {
      console.log("Got access token");
    }
    key = res.data.access_token;
    refresh_token = res.data.refresh_token;
    callback(res.data.expires_in);
  }).catch(err => {
    if (VERBOSE) {
      console.log("(Failed) to get access token");
    }
  });
}

export function searchSpotify(query: string, callback: (results: Song[]) => void) {
  if (query == "") {
    callback([]);
    return;
  }

  axios.get(
    "https://api.spotify.com/v1/search?" + stringify({
      q: query,
      type: "track",
      limit: 8
    }),
    {
      headers: {
        "Authorization": `Bearer  ${key}`
      }
    }
  ).then(res => {
    if (VERBOSE) {
      console.log("Search: " + query);
    }
    const results: Song[] = [];
    for (const track of res.data.tracks.items) {
      results.push({
        title: track.name,
        album: track.album.name,
        artist: track.artists[0].name,
        uri: track.uri,
        imgLink: track.album.images[2].url
      });
    }
    callback(results);
  }).catch(err => {
    if (VERBOSE) {
      console.log("(Failed) Search: " + query);
    }
    callback([]);
  });

}



export function getTracksInfo(ids: string[], callback: (results: Song[]) => void) {
  if (ids.length == 0) {
    callback([]);
    return;
  }
  axios.get(
    "https://api.spotify.com/v1/tracks?ids=" + ids.join(","),
    {
      headers: {
        "Authorization": `Bearer  ${key}`
      }
    }
  ).then(res => {
    if (VERBOSE) {
      console.log("Track lookup");
    }
    const results: Song[] = [];
    for (const track of res.data.tracks) {
      results.push({
        title: track.name,
        album: track.album.name,
        artist: track.artists[0].name,
        uri: track.uri,
        imgLink: track.album.images[2].url
      });
    }
    callback(results);
  }).catch(err => {
    if (VERBOSE) {
      console.log("(Failed) Track lookup");
    }
    callback([]);
  });

}


export function getCurrSong(prevSong: PlayingSong | null, callback: (res: PlayingSong | null) => void, errCallback?: () => void) {
  let usr: User;
  if (prevSong == null) {
    usr = { id: "", name: "" };
  } else {
    usr = { id: prevSong.requester.id, name: prevSong.requester.name };
  }

  axios.get(
    "https://api.spotify.com/v1/me/player",
    {
      headers: {
        "Authorization": `Bearer  ${key}`
      }
    }
  ).then(res => {
    if (VERBOSE) {
      console.log("Current song request");
    }
    if (res.data == "") {
      callback(null);
    } else {
      const currSong: PlayingSong = {
        song: {
          title: res.data.item.name,
          album: res.data.item.album.name,
          artist: res.data.item.artists[0].name,
          uri: res.data.item.uri,
          imgLink: res.data.item.album.images[1].url
        },
        time: {
          current: res.data.progress_ms / 1000,
          total: res.data.item.duration_ms / 1000
        },
        paused: !res.data.is_playing,
        requester: usr
      };
      callback(currSong);
    }
  }).catch(err => {
    if (VERBOSE) {
      console.log("(Failed) Current song request");
    }
    if (errCallback != undefined) {
      errCallback();
    }
  });
}

export function changeSong(uri: string, callback: () => void, errCallback?: ()=>void) {
  axios.put(
    "https://api.spotify.com/v1/me/player/play",
    {
      uris: [uri]
    },
    {
      headers: {
        "Authorization": `Bearer  ${key}`
      }
    }
  ).then(res => {
    if (VERBOSE) {
      console.log("Change song");
    }
    callback();
  }).catch(err => {
    if (VERBOSE) {
      console.log("(Failed) Change song");
    }
    if (errCallback != undefined){
      errCallback();
    }
  });
}