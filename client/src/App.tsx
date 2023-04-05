import { useEffect, useRef, useState } from "react";

import Header from "./Header";
import NameForm from "./NameForm";
import SearchBar from "./SearchBar";
import SongBar from "./SongBar";
import SongLists from "./SongLists";

import { socket } from "./socket";
import { APIKey, EntireQueue, NewSongData, NewUserData, PlayingSong, SingleQueue, UserChangeData } from "../../shared_types";
import { getQueue, getSongInfo, setApiKey } from "./apiManager";


export default function App({ name, id }: { name: string | null; id: string | null; }) {

  const [isConnected, setIsConnected] = useState(socket.connected);

  const [queue, setQueue] = useState<EntireQueue>({ data: [], order: [] });
  const queueRef = useRef(queue);

  const [currSong, setCurrSong] = useState<PlayingSong | null>(null);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

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
    const onForceDisconnect = ()=>{
      socket.disconnect();
    }

    const onApiKey = (key: APIKey) => {
      setApiKey(key.key);
      getQueue().then(json => {
        setQueue(json);
      }).catch(() => {
        setQueue({ data: [], order: [] });
      });
      getSongInfo().then(json=>{
        setCurrSong(json);
      })
    };

    const newUser = (data: NewUserData) => {
      const newQueue = { data: queueRef.current.data, order: Array.from(data.order) };
      newQueue.data.push({ user: data.user, songs: data.songs });
      setQueue(newQueue);
    };

    const removeUser = (data: UserChangeData) => {
      // TODO
    };

    const enqueueSong = (data: NewSongData) => {
      const newQueue = { data: Array.from(queueRef.current.data), order: Array.from(queueRef.current.order) };
      for (const q of newQueue.data) {
        if (q.user.id == data.user.id) {
          q.user.name = data.user.name;
          q.songs.push(data.song);
        }
      }
      setQueue(newQueue);
    };

    const modifyQueue = (data: SingleQueue) => {
      const newQueue = { data: Array.from(queueRef.current.data), order: Array.from(queueRef.current.order) };
      for (const q of newQueue.data) {
        if (q.user.id == data.user.id) {
          q.user.name = data.user.name;
          q.songs = data.songs;
        }
      }
      setQueue(newQueue);
    };

    const changePlayingSong = (song: PlayingSong) => {
      setCurrSong(song);
    };


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("force-disconnect", onForceDisconnect);
    socket.on("api-key", onApiKey);
    socket.on("new-user", newUser);
    socket.on("remove-user", removeUser);
    socket.on("enqueue-song", enqueueSong);
    socket.on("modify-queue", modifyQueue);
    socket.on("change-playing-song", changePlayingSong);


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("force-disconnect", onForceDisconnect);
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
        <SongBar currSong={currSong} />
      </>
    );
  } else {
    return (
      <>
        <Header connected={isConnected} />
        <SearchBar />
        <SongLists queue={queue} userId={id} currentRequesterId={currSong==undefined?"":currSong.requester.id} />
        <SongBar currSong={currSong} />
      </>
    );
  }
  
}
