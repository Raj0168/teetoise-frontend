import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useDeviceType from "../../hooks/useDeviceType";
import AdminHeader from "../../components/admin/AdminHeader";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import ToggleButton from "./ToggleButton";

import "./DeveloperPortalPage.scss";

function DeveloperPortalPage() {
  const deviceType = useDeviceType();
  const [showSidebar, setShowSidebar] = useState(deviceType !== "mobile");
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [openSection, setOpenSection] = useState(""); 

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleSectionClick = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const handleNavClick = (section) => {
    setSelectedSection(section);
    if (deviceType === "mobile") {
      setShowSidebar(false);
    }
  };

  return (
    <div className="developer-portal">
      <AdminHeader className="header" />
      <Container fluid>
        <Row>
          {deviceType === "mobile" && (
            <ToggleButton
              showSidebar={showSidebar}
              toggleSidebar={toggleSidebar}
            />
          )}
          {showSidebar && (
            <Col md={3} className="sidebar">
              <Sidebar
                openSection={openSection}
                handleSectionClick={handleSectionClick}
                handleNavClick={handleNavClick}
              />
            </Col>
          )}
          <Col md={showSidebar ? 9 : 12} className="content-area">
            <ContentArea selectedSection={selectedSection} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DeveloperPortalPage;
