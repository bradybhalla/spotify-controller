import axios from "axios";

import { response } from "express";
import {readFileSync} from "fs";

import {Song} from "../shared_types";

const key = readFileSync(__dirname + "/api_key.txt", {encoding: "utf-8"}).trim();

export function searchSpotify(query: string, callback: (results:Song[])=>void){
  if (query == ""){
    callback([]);
    return;
  }

  const num = Math.floor(Math.random()*6+1);
  const results: Song[] = [];
  for (let i=0; i<num; i++){
    results.push({
      title: "Song "+i,
      album: "Album",
      artist: "The Shins",
      songLink: "spotify.com/thesong",
      imgLink: "spotify.com/theimage"
    });
  }

  callback(results);
}