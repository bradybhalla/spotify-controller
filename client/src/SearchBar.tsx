
import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { MusicNote, Search, SearchHeart } from "react-bootstrap-icons";

import "./css/SearchBar.css";

function SearchResult({selected}: { selected?: boolean; }) {

  selected ??= false;

  return (
    <div className={"result" + (selected ? " selected" : "")}>
      This is a search result
    </div>
  );
}

export default function SearchBar() {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="input-group">
      <input
        className="form-control bg-white"
        type="text"
        placeholder="Add a song to the queue..."
        onChange={(e)=>{
          setSearchQuery(e.target.value);
        }}
      />
      <MusicNote className="search-icon" size="20px" color="gray" />
      
      <div className="results-wrapper">
        <SearchResult selected={true} />
        <SearchResult />
        <SearchResult />
      </div>
      
    </div>
  );
}

