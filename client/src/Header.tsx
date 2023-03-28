import { createElement } from "react";
import { Container, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Check, X } from 'react-bootstrap-icons';

import "./css/Header.css";

function Icon({ connected }: { connected: boolean; }) {

  const size = "36px";

  const iconType = connected ? Check : X;
  
  return (
    <>
      <OverlayTrigger placement="bottom" overlay={
        <Tooltip>
          {connected ?
            (
              "Connected"
            ) : (
              "Not Connected"
            )}
        </Tooltip>
      }>
        {
          createElement(iconType, {
            size: size,
            className: connected ? "check" : "x"
          })
        }
      </OverlayTrigger>
    </>
  );

}

export default function Header({connected}: {connected:boolean}) {

  return (

    <Navbar className="header">
      <Container fluid>
        <Navbar.Brand className="header-text" href="#">
          <img
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          /> &nbsp; Spotify Controller
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Icon connected={connected} />
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );

}