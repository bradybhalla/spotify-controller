import { DragDropContext, Draggable, DragStart, Droppable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { Button, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { GripHorizontal, PlusSquare, Trash3 } from "react-bootstrap-icons";
import { EntireQueue, SingleQueue, Song, User } from "../../shared_types";

import "./css/SongLists.css";
import { socket } from "./socket";

function SongDisplay({ song }: { song: Song; }) {

  return (
    <>
      <img src={song.imgLink} style={{ width: "25px", height: "25px" }} className="me-2" />
      <div>
        <span>{song.title}</span>
        <span><i>, {song.artist}</i></span>
      </div>
    </>
  );
}

function DraggableSongListItem({ song, index, draggingIndex, onDelete }: { song: Song; index: number; draggingIndex: number | null; onDelete: () => void; }) {
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

function SongList({ user, songs, viewAllActivated, currentRequester }: { user: User; songs: Song[]; viewAllActivated: boolean; currentRequester: boolean; }) {
  return (
    <Col className={"song-list-col" + (viewAllActivated ? "" : " d-none d-sm-block")}>
      <h3 className={currentRequester ? "underline" : ""}>{user.name}</h3>
      <ListGroup className="list-group-flush">
        {
          songs.map((el, index) => (
            <ListGroupItem className="d-flex" key={index}>
              <SongDisplay song={el} />
            </ListGroupItem>
          ))
        }
      </ListGroup>
    </Col>
  );
}


function ModifiableSongList({ user, songs, currentRequester }: { user: User; songs: Song[]; currentRequester: boolean; }) {

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);


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
      const newSongs = Array.from(songs);
      newSongs.splice(source.index, 1);
      newSongs.splice(destination.index, 0, songs[source.index]);
      socket.emit("modify-queue", newSongs);
    }

    setDraggingIndex(null);
  };


  return (
    <Col className="song-list-col">
      <h3 className={currentRequester ? "underline" : ""}>{user.name}</h3>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {
            (provided) => (

              <ListGroup className="" ref={provided.innerRef} {...provided.droppableProps}>
      
                {
                  songs.map((el, index) => (
                    <DraggableSongListItem key={index} index={index} song={el} draggingIndex={draggingIndex} onDelete={() => {
                      const newSongs = Array.from(songs);
                      newSongs.splice(index, 1);
                      socket.emit("modify-queue", newSongs);
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

export default function SongLists({ queue, userId, currentRequesterId }: { queue: EntireQueue; userId: string; currentRequesterId: string; }) {

  const [viewAllActivated, setViewAllActivated] = useState(false);

  // map id to queue
  const allSongs: Map<string, SingleQueue> = new Map();

  for (const q of queue.data) {
    allSongs.set(q.user.id, q);
  }

  const songOrder = queue.order;

  const currIndex = songOrder.indexOf(userId);
  if (currIndex == -1) {
    return (
      <Container fluid className="song-list-container">
        <Row className="song-list-row flex-nowrap"></Row>
      </Container>
    );
  }

  const lists = [];
  for (let i = 0; i < songOrder.length; i++) {
    const id = songOrder[(i + currIndex) % songOrder.length];
    const data = allSongs.get(id)!;
    if (i == 0) {
      lists.push(<ModifiableSongList key={id} user={data.user} songs={data.songs} currentRequester={id == currentRequesterId} />);
    } else {
      lists.push(<SongList key={id} user={data.user} songs={data.songs} viewAllActivated={viewAllActivated} currentRequester={id == currentRequesterId} />);
    }
  }

  return (
    <Container fluid className="song-list-container">
      <Row className="song-list-row flex-nowrap">
        {lists}
      </Row>
      <Button id="show-all-btn" className={"d-xs-block d-sm-none" + (viewAllActivated ? " activated" : "")} onClick={() => setViewAllActivated(!viewAllActivated)}><PlusSquare /></Button>
    </Container>
  );
}