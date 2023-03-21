
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { MusicNote, Search, SearchHeart } from "react-bootstrap-icons";

import { getApiKey } from "./apiManager";

import "./css/SearchBar.css";

function SearchResult({selected }: { selected?: boolean }) {

  selected ??= false;

  return (
    <div className={"result" + (selected ? " selected" : "")}>
      This is a search result
    </div>
  );
}

export default function SearchBar() {

  const [searchResults, setSearchResults] = useState<number[]>([]);

  function updateResults(query: string){
    setSearchResults([]);
    console.log("Searching for result");

  }

  return (
    <div className="input-group">
      <input
        className="form-control bg-white"
        type="text"
        placeholder="Add a song to the queue..."
        onChange={(e) => {
          updateResults(e.target.value)
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
              console.log(el.value)
              el.value = "";
              (document.activeElement as HTMLElement).blur();
            }
          }
        }
      />
      <MusicNote className="search-icon" size="20px" color="gray" />
      
      <div id="search-results" className="d-none">
        {
          searchResults.map(resData => {

            return <SearchResult />
          })
        }
      </div>
      
    </div>
  );
}

