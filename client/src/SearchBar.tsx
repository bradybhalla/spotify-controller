
import { useState } from "react";
import { MusicNote } from "react-bootstrap-icons";
import { Song } from "../../shared_types";

import { getSearchResults } from "./apiManager";

import "./css/SearchBar.css";
import { socket } from "./socket";

function SearchResult({ song, selected }: { song: Song, selected?: boolean; }) {

  selected ??= false;

  return (
    <div className={"result" + (selected ? " selected" : "")}>
      {song.title}, {song.artist}, {song.songLink}
    </div>
  );
}

export default function SearchBar() {

  const [searchResults, setSearchResults] = useState<Song[]>([]);

  function updateResults(query: string) {
    getSearchResults(query).then(json => {
      setSearchResults(json);
    });
  }

  return (
    <div className="input-group">
      <input
        className="form-control bg-white"
        type="text"
        placeholder="Add a song to the queue..."
        onChange={(e) => {
          updateResults(e.target.value);
        }}
        onFocus={
          () => {
            document.getElementById("search-results")?.classList.remove("d-none");
          }
        }
        onBlur={
          () => {
            document.getElementById("search-results")?.classList.add("d-none");
          }
        }
        onKeyDown={
          (e) => {
            if (e.code == "Enter") {
              const el = (e.target as HTMLInputElement);
              console.log(el.value);
              socket.emit("enqueue-song", {
                title: el.value,
                album: "",
                artist: "",
                songLink: "",
                imgLink: ""
              });
              el.value = "";
              (document.activeElement as HTMLElement).blur();
            }
          }
        }
      />
      <MusicNote className="search-icon" size="20px" color="gray" />
      
      <div id="search-results" className="d-none">
        {
          searchResults.map((result, index) => 
            <SearchResult 
              song={result}
              key={index}
            />)
        }
      </div>
      
    </div>
  );
}

