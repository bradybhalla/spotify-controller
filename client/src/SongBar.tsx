import { Col, Container, ProgressBar, Row } from "react-bootstrap";;
import { Socket } from "socket.io-client";

import "./css/SongBar.css";

function CurrentSong() {
  return (
    <div className="d-flex align-items-center current-song">
      <img className="song-icon" src="https://i.scdn.co/image/ab67616d000048514205b816277c7f9dba098d28" />
      <div className="song-info ms-2">
        <div>the longest name of a song that I can think of so it overflows</div>
        <div>Album</div>
        <div>The Shins</div>
      </div>
    </div>
  );
}

function SongTime({currTime, maxTime}: { currTime: number; maxTime: number; }) {
  return (
      <div className="song-time d-none d-sm-flex align-items-center ms-5">
        <span className="me-1">
          {Math.floor(currTime/60)}:
          { `${Math.floor(currTime%60)}`.padStart(2,"0") }
        </span>
        <ProgressBar now={currTime/maxTime*100} />
        <span className="ms-1">
          {Math.floor(maxTime/60)}:
          { `${Math.floor(maxTime%60)}`.padStart(2,"0") }
        </span>
      </div>
  );
}

export default function SongBar() {

  return (
    <Container fluid className="footer d-flex align-items-center justify-content-center">
      <CurrentSong />
      <SongTime currTime={200} maxTime={241}/>
    </Container>
  );
}