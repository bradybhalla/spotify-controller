import { Container } from "react-bootstrap";

import "./css/NameForm.css";

export default function NameForm() {
  return (
    <Container className="mt-5 flex-fill">
      <form style={{ textAlign: "center" }}>
        <input type="hidden" name="id" value={Math.floor(Math.random() * 1e10)} />
        <div className="input-group">
          <input name="name" autoComplete="off" className="bg-white form-control" placeholder="Enter your name..." required />
          <button type="submit" className="btn btn-primary">Go</button>
        </div>
      </form>
    </Container>
  );
}