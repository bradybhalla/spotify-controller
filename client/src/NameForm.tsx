import { useState } from "react";
import { Container } from "react-bootstrap";

export default function NameForm() {
  const [id, setId] = useState("");
  return (
    <Container className="mt-5 flex-fill">
      <form style={{ textAlign: "center" }}>
        {/*USE RANDOM ID: <input type="hidden" name="id" value={Math.floor(Math.random() * 1e10)} />*/}
        <input type="hidden" name="id" value={id} />
        <div className="input-group">
          <input name="name" autoComplete="off" className="bg-white form-control" placeholder="Enter your name..." onChange={(e) => {
            setId(e.target.value);
          }} required />
          <button type="submit" className="btn btn-primary">Go</button>
        </div>
      </form>
    </Container>
  );
}