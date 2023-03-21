import {socket} from "./socket";

/**
 * Interact with the server's api
 */


let apiKey: string|null = null;

socket.on("api-key", key=>{
  apiKey = key;
});

export function getApiKey(){
  return apiKey;
}

export function sendPost(){
  
}