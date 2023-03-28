import { DragDropContext, Draggable, DragStart, Droppable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { Button, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { GripHorizontal, PlusSquare, Trash3 } from "react-bootstrap-icons";
import { DevSong, EntireQueue, SingleQueue, User } from "../../shared_types";

import "./css/SongLists.css";

function SongDisplay({ song }: { song: DevSong; }) {

  return (
    <div>{song.title}</div>
  );
}

function DraggableSongListItem({ song, index, draggingIndex, onDelete, ...other }: { song: DevSong; index: number; draggingIndex: number | null; onDelete: () => void; }) {
  return (
    <Draggable draggableId={`${index}`} index={index}>
      {(provided) => (
        <ListGroupItem className={"d-flex align-items-center" + (draggingIndex == null ? "" : (draggingIndex == index ? " dragging" : " not-dragging"))} ref={provided.innerRef} {...provided.draggableProps}>
          <div className="me-2" {...provided.dragHandleProps}>
            <GripHorizontal className="drag-icon" />
          </div>
          <SongDisplay song={song} />
          <Button className="btn-secondary ms-auto trash-button" onClick={onDelete}>
            <Trash3 className="trash-icon" />
          </Button>
        </ListGroupItem>
      )}
    </Draggable>
  );
}

function SongList({ user, songs, viewAllActivated }: { user: User; songs: DevSong[]; viewAllActivated: boolean; }) {
  return (
    <Col className={"song-list-col" + (viewAllActivated ? "" : " d-none d-sm-block")}>
      <h3>{user.name}</h3>
      <ListGroup className="list-group-flush">
        {
          songs.map((el, index) => (
            <ListGroupItem key={index}>
              <SongDisplay song={el} />
            </ListGroupItem>
          ))
        }
      </ListGroup>
    </Col>
  );
}


function ModifiableSongList({ user, songs }: { user: User; songs: DevSong[]; }) {

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const [songsState, setSongsState] = useState(songs);

  const onDragStart = (start: DragStart) => {
    setDraggingIndex(start.source.index);
  };

  const onDragEnd = (end: DropResult) => {
    const { destination, source } = end;
    if (!destination) {

    } else if (source.droppableId == destination.droppableId &&
      source.index == destination.index
    ) {
      
    } else {
      const newSongs = Array.from(songsState);
      newSongs.splice(source.index, 1);
      newSongs.splice(destination.index, 0, songsState[source.index]);
      setSongsState(newSongs);
    }

    setDraggingIndex(null);
  };


  return (
    <Col className="song-list-col">
      <h3>{user.name}</h3>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {
            (provided) => (

              <ListGroup className="" ref={provided.innerRef} {...provided.droppableProps}>
      
                {
                  songsState.map((el, index) => (
                    <DraggableSongListItem key={index} index={index} song={el} draggingIndex={draggingIndex} onDelete={() => {
                      const newSongs = Array.from(songsState);
                      newSongs.splice(index, 1);
                      setSongsState(newSongs);
                      // send delete to server
                    }} />
                  ))
                }

                {provided.placeholder}
      
              </ListGroup>
            )
          }
        
        </Droppable>
      </DragDropContext>
    </Col>
  );
}

export default function SongLists({ queue }: { queue: EntireQueue | null; }) {
  if (queue == null) {
    return (
      <Container fluid className="song-list-container">
        <Row className="song-list-row flex-nowrap">
          <Col></Col>
        </Row>
      </Container>
    );
  }

  // map id to queue
  const allSongs: Map<string, SingleQueue> = new Map();

  for (const q of queue.data){
    allSongs.set(q.user.id, q);
  }

  const songOrder = queue.order;

  console.log(allSongs, songOrder)

  const [viewAllActivated, setViewAllActivated] = useState(false);

  return (
    <Container fluid className="song-list-container">
      <Row className="song-list-row flex-nowrap">
        {
          songOrder.map((id, index) => {
            const data = allSongs.get(id)!;
            if (index == 0) {
              return <ModifiableSongList key={id} user={data.user} songs={data.songs} />;
            }
            return <SongList key={id} user={data.user} songs={data.songs} viewAllActivated={viewAllActivated} />;
          })
        }
      </Row>
      <Button id="show-all-btn" className={"d-xs-block d-sm-none" + (viewAllActivated ? " activated" : "")} onClick={() => setViewAllActivated(!viewAllActivated)}><PlusSquare /></Button>
    </Container>
  );
}