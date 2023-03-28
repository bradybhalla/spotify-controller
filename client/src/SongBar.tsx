import { useEffect, useState } from "react";
import { Container, ProgressBar } from "react-bootstrap";

import "./css/SongBar.css";

import { Song, PlayingSong } from "../../shared_types";

function CurrentSong({ song }: { song: Song; }) {
  return (
    <div className="d-flex align-items-center current-song">
      <img className="song-icon" src={song.imgLink} />
      <div className="song-info ms-2">
        <div>{song.title}</div>
        <div>{song.album}</div>
        <div>{song.artist}</div>
      </div>
    </div>
  );
}

function SongTime({ currTime, maxTime, paused }: { currTime: number; maxTime: number; paused: boolean; }) {
  const startTimestamp = Date.now();
  const startTime = Math.min(currTime, maxTime);
  const [time, setTime] = useState(Math.min(currTime, maxTime));

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setTime(Math.min(startTime + (Date.now() - startTimestamp) / 1000, maxTime));
      }, 500);

      return () => { clearInterval(interval); };
    }
  }, []);

  return (
    <div className="song-time d-none d-sm-flex align-items-center ms-5">
      <span className="me-1">
        {Math.floor(time / 60)}:
        {`${Math.floor(time % 60)}`.padStart(2, "0")}
      </span>
      <ProgressBar now={time / maxTime * 100} id="time" />
      <span className="ms-1">
        {Math.floor(maxTime / 60)}:
        {`${Math.floor(maxTime % 60)}`.padStart(2, "0")}
      </span>
    </div>
  );
}


export default function SongBar() {

  const currSong: PlayingSong = {
    song: {
      title: "New Slang",
      album: "Oh Inverted World",
      artist: "The Shins",
      songLink: "spotify.com/new_slang",
      imgLink: "https://i.scdn.co/image/ab67616d000048514205b816277c7f9dba098d28"
    },
    time: {
      current: 280,
      total: 300
    },
    paused: false,
    requester: {
      id: "10101",
      name: "Brady"
    }
  };

  return (
    <Container fluid className="footer d-flex align-items-center justify-content-center">
      <CurrentSong song={currSong.song} />
      <SongTime
        currTime={currSong.time.current}
        maxTime={currSong.time.total}
        paused={currSong.paused} 
      />
    </Container>
  );
}