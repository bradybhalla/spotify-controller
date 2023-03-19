import React from "react";
import { createElement, useEffect, useRef, useState } from "react";
import { Container, Navbar, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Check, X } from 'react-bootstrap-icons';
import ReactDOM from "react-dom";
import { Socket } from "socket.io-client";

import "./css/Header.css";

function Icon(props: { connected: boolean }) {
  const connected = props.connected;

  const size = "32px";

  useEffect(()=>{
    // socket things

    return ()=>{
      // cleanup
    }
  })


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

export default function Header(props: { connected: boolean }) {

  const connected = props.connected;

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