/**
 * Interact with the server's api
 */


let apiKey: string | null = null;

export function setApiKey(key: string){
  apiKey = key;
}

async function postPromise(path: string, data: Object) {
  const res = await fetch(path, {
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

export function getLinkInfo(ids: string[]){
  return postPromise("/api/idsInfo", {ids: ids, key: apiKey});
}

export function getSongInfo(){
  return postPromise("/api/currentSong", {key: apiKey});
}

export function getQueue(){
  return postPromise("/api/queue", {key: apiKey});
}