import React, { useState } from "react";
import { Modal, Table, Button, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SizeChartModal = ({ show, onHide, clothFit }) => {
  const [unit, setUnit] = useState("inches");

  const regularInches = [
    { size: "S", chest: 38, shoulder: 16, length: 26, sleeves: 7.5 },
    { size: "M", chest: 39, shoulder: 17, length: 27, sleeves: 8.5 },
    { size: "L", chest: 42, shoulder: 18.5, length: 28, sleeves: 9 },
    { size: "XL", chest: 44, shoulder: 19.5, length: 29, sleeves: 9.5 },
    { size: "XXL", chest: 46, shoulder: 20.5, length: 29.5, sleeves: 9.5 },
  ];

  const regularCms = [
    { size: "S", chest: 96.52, shoulder: 40.64, length: 66.04, sleeves: 19.05 },
    { size: "M", chest: 99.06, shoulder: 43.18, length: 68.58, sleeves: 21.59 },
    {
      size: "L",
      chest: 106.68,
      shoulder: 46.99,
      length: 71.12,
      sleeves: 22.86,
    },
    {
      size: "XL",
      chest: 111.76,
      shoulder: 49.53,
      length: 73.66,
      sleeves: 24.13,
    },
    {
      size: "XXL",
      chest: 116.84,
      shoulder: 52.07,
      length: 74.93,
      sleeves: 24.13,
    },
  ];

  const oversizedInches = [
    { size: "S", chest: 42, shoulder: 20, length: 27, sleeves: 9.5 },
    { size: "M", chest: 44, shoulder: 20.5, length: 27, sleeves: 9.5 },
    { size: "L", chest: 45, shoulder: 21.5, length: 27.5, sleeves: 9.5 },
    { size: "XL", chest: 46, shoulder: 22, length: 27.5, sleeves: 9.5 },
    { size: "XXL", chest: 50, shoulder: 24, length: 29, sleeves: 10 },
  ];

  const oversizedCms = [
    { size: "S", chest: 106.68, shoulder: 50.8, length: 68.58, sleeves: 24.13 },
    {
      size: "M",
      chest: 111.76,
      shoulder: 52.07,
      length: 69.85,
      sleeves: 24.13,
    },
    { size: "L", chest: 114.3, shoulder: 54.61, length: 69.85, sleeves: 24.13 },
    {
      size: "XL",
      chest: 116.84,
      shoulder: 55.88,
      length: 69.85,
      sleeves: 24.13,
    },
    { size: "XXL", chest: 127, shoulder: 60.96, length: 73.66, sleeves: 25.4 },
  ];

  const sizeChart = {
    REGULAR: { inches: regularInches, cm: regularCms },
    OVERSIZED: { inches: oversizedInches, cm: oversizedCms },
  };

  const currentChart = sizeChart[clothFit]?.[unit];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Size Chart: {clothFit}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest</th>
              <th>Shoulder</th>
              <th>Length</th>
              <th>Sleeves</th>
            </tr>
          </thead>
          <tbody>
            {currentChart?.map((row) => (
              <tr key={row.size}>
                <td>{row.size}</td>
                <td>{row.chest}</td>
                <td>{row.shoulder}</td>
                <td>{row.length}</td>
                <td>{row.sleeves}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-center mt-1">
          <Button
            variant={unit === "inches" ? "warning" : "secondary"}
            onClick={() => setUnit("inches")}
            className="mr-2"
          >
            Inches
          </Button>
          <Button
            variant={unit === "cm" ? "warning" : "secondary"}
            onClick={() => setUnit("cm")}
          >
            CM
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SizeChartModal;
