import { socket } from "./socket";

/**
 * Interact with the server's api
 */

const URL = "http://localhost:8080";


let apiKey: string | null = null;

export function setApiKey(key: string){
  apiKey = key;
}

async function postPromise(path: string, data: Object) {
  const res = await fetch(URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export function getSearchResults(query: string){
  return postPromise("/api/search", {query: query, key: apiKey});
}

export function getSongInfo(){
  return postPromise("/api/currSong", {key: apiKey});
}

export function getQueue(){
  return postPromise("/api/queue", {key: apiKey});
}