import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Image } from "react-bootstrap";
import { logout } from "../../JS/actions/useraction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DemandeStage from "../Student/DemandeStage";
import {
  getallApplications,
  getallCompanies,
} from "../../JS/actions/companyactions";
import AjouterEntreprise from "../Student/AjouterEntreprise";
import { getAllAccounts } from "../../JS/actions/accountactions";
import StagesActifs from "../Student/StagesActifs";
import Rapports from "../Student/Rapports";
import { getAllReports } from "../../JS/actions/rapportactions";
import SoutenanceStudent from "../Student/SoutenanceStudent";
import Logo from "../LogIn/Logo.svg";
import circleLogo from "../LogIn/CircleLogo.svg";
import "./Dashboard.css";
import { RiNewspaperLine } from "react-icons/ri";
import { FaGears } from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoCalendarOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { BsBuildings } from "react-icons/bs";
import { getAllNotifications } from "../../JS/actions/notificationactions";
import NotificationPanelStudent from "../Student/NotificationPanelStudent";
import { IoNotificationsCircleOutline } from "react-icons/io5";

const StudentDashboard = () => {
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allNotifications = useSelector(
    (state) => state.notificationR.notifications
  );
  useEffect(() => {
    dispatch(getallCompanies());
    dispatch(getallApplications());
    dispatch(getAllAccounts());
    dispatch(getAllReports());
    dispatch(getAllNotifications());
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleTabSelect = (eventKey) => {
    setActiveTab(eventKey);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };
  const logoMarginLeft = isMouseOver ? "0%" : "-100%";
  const circlelogoMarginLeft = isMouseOver ? "100%" : "-25%";

  const userNotifications = allNotifications.filter(
    (notification) =>
      notification.student === currentUser._id &&
      notification.isEdited &&
      notification.sender !== "student report" &&
      notification.studentStatus === "unread"
  );

  const hasUnreadNotifications = userNotifications.length > 0;

  return (
    <Container style={{ background: "#3A3B3D" }} fluid>
      <Row>
        <Col
          style={{ minHeight: "100vh", height: "auto" }}
          sm={3}
          className="bg-dark text-white sidebar"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4">
            <div
              style={{
                width: "270px",
                height: "70px",
                marginBottom: "10px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={Logo}
                fluid
                style={{
                  width: "200%",
                  height: "100%",
                  position: "absolute",
                  left: logoMarginLeft,
                  transition: "left 0.2s ease-in-out",
                }}
              />
              <Image
                src={circleLogo}
                fluid
                style={{
                  width: "70%",
                  height: "70%",
                  position: "absolute",
                  left: circlelogoMarginLeft,
                  transition: "left 0.2s ease-in-out",
                }}
              />
            </div>

            <Nav
              variant="pills"
              className="flex-column"
              activeKey={activeTab}
              onSelect={handleTabSelect}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Nav.Item>
                <Nav.Link eventKey="tab1">
                  <IoNotificationsCircleOutline
                    size={30}
                    style={{
                      color: hasUnreadNotifications ? "#D74E21" : "white",
                    }}
                  />
                  <span>Notifications</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab2">
                  <RiNewspaperLine size={30} />
                  <span> Demandes de Stages</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab3">
                  <FaGears size={30} />
                  <span> Stages Actifs</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab4">
                  <BsBuildings size={30} />
                  <span> Ajouter une entreprise</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="tab5">
                  <HiOutlineClipboardDocumentList size={30} />
                  <span> Rapports</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab6">
                  <IoCalendarOutline size={30} />
                  <span> Soutenances</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab7" onClick={handleLogout}>
                  <TbLogout2 size={30} />
                  <span> Log out</span>
                </Nav.Link>
              </Nav.Item>
              {/* Add more tabs as needed */}
            </Nav>
          </div>
        </Col>
        <Col
          style={{
            background: "#3A3B3D",
            width: "100%",
          }}
        >
          <div className="p-4">
            {activeTab === "tab1" && <NotificationPanelStudent />}
            {activeTab === "tab2" && <DemandeStage />}
            {activeTab === "tab3" && <StagesActifs />}
            {activeTab === "tab4" && <AjouterEntreprise />}
            {activeTab === "tab5" && <Rapports />}
            {activeTab === "tab6" && <SoutenanceStudent />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
