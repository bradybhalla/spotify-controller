import React from "react";
import { createElement, useEffect, useRef, useState } from "react";
import { Container, Navbar, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Check, X } from 'react-bootstrap-icons';
import ReactDOM from "react-dom";
import { Socket } from "socket.io-client";

import "./css/Header.css";

import {socket} from "./socket";

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

export default function Header() {

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };

  }, []);

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
          <Icon connected={isConnected} />
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );

}