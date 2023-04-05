
import { useEffect, useState } from "react";
import { MusicNote } from "react-bootstrap-icons";
import { Song } from "../../shared_types";

import { getLinkInfo, getSearchResults } from "./apiManager";

import "./css/SearchBar.css";
import { socket } from "./socket";



function SearchResult({ song, selected, clearResultsCallback }: { song: Song, selected: boolean, clearResultsCallback: () => void; }) {

  return (
    <div className={"result" + (selected ? " selected" : "")} onClick={() => {
      const searchBar = (document.getElementById("search-bar") as HTMLInputElement);
      searchBar.value = "";
      clearResultsCallback();

      socket.emit("enqueue-song", song);
      
    }}>
      {song.title}, {song.artist}
    </div>
  );
}

export default function SearchBar() {

  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [focus, setFocus] = useState({
    searchActive: false,
    resultsHover: false
  });

  const showResults = focus.searchActive || focus.resultsHover;

  useEffect(() => {
    document.body.onkeydown = (e) => {
      if (e.code == "Enter") {
        document.getElementById("search-bar")?.focus();
      }
    };
  }, []);

  function updateResults(query: string) {
    if (query == "") {
      // empty query
      setSearchResults([]);
    } else if (query.indexOf("https://open.spotify.com/") == 0) {
      // link pasted
      setSearchResults([]);
      (document.getElementById("search-bar") as HTMLInputElement).value = "";

      const idsMatches = query.matchAll(/https:\/\/open\.spotify\.com\/track\/(.{22})/gm);
      const ids = [];
      for (const match of idsMatches) {
        ids.push(match[1]);
      }
      if (ids.length > 20) {
        alert("Please only paste at most 20 songs");
      } else {
        getLinkInfo(ids).then(json => {
          json.map((song: Song, index: number) => {
            setTimeout(() => {
              socket.emit("enqueue-song", song);
            }, index * 50);
          });
        });
      }

    } else {
      // normal search
      getSearchResults(query).then(json => {
        if ((document.getElementById("search-bar") as HTMLInputElement).value != "") {
          setSearchResults(json);
        }
      });
    }
  }

  return (
    <div className="input-group">
      <input
        id="search-bar"
        className="form-control bg-white"
        type="text"
        placeholder="Add a song to the queue..."
        onChange={(e) => {
          setSelectedIndex(0);
          updateResults(e.target.value);
        }}
        onFocus={
          () => {
            setFocus({ ...focus, searchActive: true });
          }
        }
        onBlur={
          () => {
            setFocus({ ...focus, searchActive: false });
          }
        }
        onKeyDown={
          (e) => {
            if (e.code == "Enter") {
              const el = (e.target as HTMLInputElement);
              if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
                socket.emit("enqueue-song", searchResults[selectedIndex]);
                el.value = "";
                updateResults("");
              } else {
                setSelectedIndex(0);
              }

            } else if (e.code == "Escape") {
              (document.activeElement as HTMLElement).blur();
            } else if (e.code == "ArrowDown" && selectedIndex < searchResults.length-1){
              setSelectedIndex(selectedIndex + 1);
            } else if (e.code == "ArrowUp" && selectedIndex > 0){
              setSelectedIndex(selectedIndex - 1);
            }
          }
        }
      />
      <MusicNote className="search-icon" size="20px" color="gray" />
      
      <div
        id="search-results"
        className={showResults ? "" : "d-none"}
        onMouseEnter={() => {
          setFocus({ ...focus, resultsHover: true });
        }}
        onMouseLeave={() => {
          setFocus({ ...focus, resultsHover: false });
        }}>
        {
          searchResults.map((result, index) => 
            <SearchResult 
              song={result}
              key={index}
              selected={index == selectedIndex}
              clearResultsCallback={() => setSearchResults([])}
            />)
        }
      </div>
      
    </div>
  );
}

