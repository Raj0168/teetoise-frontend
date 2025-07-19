import React from "react";
import { Button } from "react-bootstrap";

const ToggleButton = ({ showSidebar, toggleSidebar }) => (
  <Button variant="primary" className="toggle-button" onClick={toggleSidebar}>
    {showSidebar ? "Hide Menu" : "Show Menu"}
  </Button>
);

export default ToggleButton;
