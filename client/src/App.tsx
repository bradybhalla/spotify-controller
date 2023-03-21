import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";

import { socket } from "./socket";

import Header from "./Header";
import NameForm from "./NameForm";
import SearchBar from "./SearchBar";
import SongBar from "./SongBar";
import SongLists from "./SongLists";


export default function App({ name, id }: { name: string | null; id: string | null; }) {

  if (name == null || id == null) {
    return (
      <>
        <Header />
        <NameForm />
        <SongBar />
      </>
    );
  } else {
    return (
      <>

        <Header />

        <SearchBar />

        <SongLists />

        <SongBar />
      
      </>

    );
  }
  
}
