
import { Button, Form, InputGroup, Row } from "react-bootstrap";
import { MusicNote, Search, SearchHeart } from "react-bootstrap-icons";

import "./css/SearchBar.css";

export default function SearchBar() {

  return (
  <div className="input-group">
      <input className="form-control bg-white" type="text" placeholder="Add a song to the queue..." />
      <MusicNote className="search-icon" size="20px" color="gray" />
  </div>
  );
}

