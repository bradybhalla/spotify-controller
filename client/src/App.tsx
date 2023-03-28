import { useEffect, useState } from "react";

import Header from "./Header";
import NameForm from "./NameForm";
import SearchBar from "./SearchBar";
import SongBar from "./SongBar";
import SongLists from "./SongLists";

import { socket } from "./socket";
import { APIKey, EntireQueue, ModifiedQueueData, NewSongData, NewUserData, PlayingSong, SingleQueue, UserChangeData } from "../../shared_types";
import { getQueue, getSongInfo, setApiKey } from "./apiManager";


export default function App({ name, id }: { name: string | null; id: string | null; }) {

  const [isConnected, setIsConnected] = useState(socket.connected);

  const [queue, setQueue] = useState<EntireQueue | null>(null);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      if (name != null && id != null) {
        socket.emit("user-info", { name: name, id: id });
      }
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onApiKey = (key: APIKey) => {
      setApiKey(key.key);
      getQueue().then(json => {
        setQueue(json);
      });
    };

    const newUser = (data: NewUserData) => {
      // TODO
    };

    const removeUser = (data: UserChangeData) => {
      // TODO
    };

    const enqueueSong = (data: NewSongData) => {
      // TODO
    };

    const modifyQueue = (data: SingleQueue) => {
      // TODO
    };

    const changePlayingSong = (song: PlayingSong) => {
      // TODO
    };


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("api-key", onApiKey);
    socket.on("new-user", newUser);
    socket.on("remove-user", removeUser);
    socket.on("enqueue-song", enqueueSong);
    socket.on("modify-queue", modifyQueue);
    socket.on("change-playing-song", changePlayingSong);


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("api-key", onApiKey);
      socket.off("new-user", newUser);
      socket.off("remove-user", removeUser);
      socket.off("enqueue-song", enqueueSong);
      socket.off("modify-queue", modifyQueue);
      socket.off("change-playing-song", changePlayingSong);
    };

  }, []);

  if (name == null || id == null) {
    return (
      <>
        <Header connected={isConnected} />
        <NameForm />
        <SongBar />
      </>
    );
  } else {
    return (
      <>
        <Header connected={isConnected} />
        <SearchBar />
        <SongLists queue={queue} />
        <SongBar />
      </>
    );
  }
  
}
