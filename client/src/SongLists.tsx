import { Col, Container, Row } from "react-bootstrap";
import { Socket } from "socket.io-client";


import "./css/SongLists.css";

type SongData = {
  name: string;
};

function SongList({ user, songs }: { user: string; songs: SongData[]; }) {
  return (
    <Col className="song-list-col">
      <h3>{user}</h3>
      {
        songs.map(song => (
          <p key={Math.random()}>
            {song.name}
          </p>
        ))
      }
    </Col>
  );
}

export default function SongLists() {

  return (
    <Container fluid className="song-list-container">
      <Row className="song-list-row">
        <SongList user="Brady" songs={[
          { name: "ASDF" },
          { name: "song" },
          { name: "A really really really really really really really long song" },
          { name: "New Slang" },
        ]} />
        <SongList user="Mo Smith" songs={[
          { name: "rrerjewjewnje" },
          { name: "ohio man is coming for you" },
          { name: "Afraid of the Dark" },
          { name: "Cold cold Cold" },
        ]} />
        <SongList user="lalalalal" songs={[
          { name: "rrerjewjewnje" },
          { name: "ohio man is coming for you" },
          { name: "Afraid of the Dark" },
          { name: "Cold cold Cold" },
          { name: "ASDF" },
          { name: "song" },
          { name: "A really really" },
          { name: "New Slang" },
          { name: "rrerjewjewnje" },
          { name: "ohio man is coming for you" },
          { name: "Afraid of the Dark" },
          { name: "Cold cold Cold" },
          { name: "ASDF" },
          { name: "song" },
          { name: "A really really" },
          { name: "New Slang" }
        ]} />
      </Row>
    </Container>
  );
}