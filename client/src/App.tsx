import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import { io } from 'socket.io-client';

import Header from "./Header";
import SongLists from "./SongLists";
import SongBar from "./SongBar";
import SearchBar from "./SearchBar";

const socket = io();

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  });

  return (
    <>

        <Header connected={isConnected} />

        <SearchBar />

        <SongLists />

        <SongBar />
    </>

  );
}
