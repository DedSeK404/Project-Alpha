import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Image, Toast } from "react-bootstrap";
import { logout } from "../../JS/actions/useraction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DemandeStageAdmin from "../Admin/DemandeStageAdmin";
import NotificationPanel from "../Admin/NotificationPanel";
import { getallApplications } from "../../JS/actions/companyactions";
import AccountManagement from "../Admin/AccountManagment";
import { getAllAccounts } from "../../JS/actions/accountactions";
import StagesActifsAdmin from "../Admin/StageActifsAdmin";
import { getAllReports } from "../../JS/actions/rapportactions";
import RapportsAdmin from "../Admin/RapportsAdmin";
import SoutenanceAdmin from "../Admin/SoutenanceAdmin";
import Logo from "../LogIn/Logo.svg";
import circleLogo from "../LogIn/CircleLogo.svg";
import "./Dashboard.css";
import { RiNewspaperLine } from "react-icons/ri";
import { FaGears } from "react-icons/fa6";
import { PiChalkboardTeacher } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoCalendarOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { getAllNotifications } from "../../JS/actions/notificationactions";
import { io } from "socket.io-client";
import moment from "moment";

const AdminDashboard = () => {
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allNotifications = useSelector(
    (state) => state.notificationR.notifications
  );
  const [showToast, setShowToast] = useState(false);
  const [notificationData, setNotificationData] = useState({});

  useEffect(() => {
    const socket = io("http://localhost:4500"); // Replace with your server URL

    // Event listener for "newNotification" event from the server
    socket.on("newNotification", (data) => {
   
      if (data.toAdmin === true) {
        setNotificationData(data);
        setShowToast(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    dispatch(getallApplications());
    dispatch(getAllAccounts());
    dispatch(getAllReports());
    dispatch(getAllNotifications());
  }, [dispatch]);

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
      notification.toAdmin === true && notification.adminStatus === "unread"
  );

  const hasUnreadNotifications = userNotifications.length > 0;
  const handleCloseToast = () => {
    dispatch(getAllNotifications());
    setShowToast(false);
  };
 
  return (
    <Container style={{ background: "#3A3B3D" }} fluid>
      <div style={{ position: "fixed", top: "2%", right: "2%", zIndex: "2" }}>
        <Toast bg="secondary" show={showToast} onClose={handleCloseToast}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>
            <strong style={{ color: "white" }}>
              {notificationData.sender === "teacher_approve"
                ? "A teacher"
                : notificationData.sender}
            </strong>
            <p style={{ color: "white" }}>
              {notificationData.sender === "teacher_approve"
                ? "has approved an application's report"
                : "has submitted an application"}
            </p>
            <p
              style={{
                fontSize: "smaller",
                color: "#CCCCCC",
                textAlign: "end",
                margin: "-10px 0px",
              }}
            >
              {moment(notificationData.timestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </p>
          </Toast.Body>
        </Toast>
      </div>
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
                    style={{
                      color: hasUnreadNotifications ? "#D74E21" : "white",
                    }}
                    size={30}
                  />
                  <span>Notifications</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab2">
                  <RiNewspaperLine size={30} />
                  <span>Demandes de Stages</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab3">
                  <FaGears size={30} />
                  <span>Stages Actifs</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab4">
                  <PiChalkboardTeacher size={30} />
                  <span>Ajouter un professionnel</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab5">
                  <HiOutlineClipboardDocumentList size={30} />
                  <span>Rapports</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab6">
                  <IoCalendarOutline size={30} />
                  <span>Soutenances</span>
                </Nav.Link>
              </Nav.Item>
              <hr />
              <Nav.Item>
                <Nav.Link eventKey="tab7" onClick={handleLogout}>
                  <TbLogout2 size={30} /> <span>Log out</span>
                </Nav.Link>
              </Nav.Item>
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
            {activeTab === "tab1" && <NotificationPanel />}
            {activeTab === "tab2" && <DemandeStageAdmin />}
            {activeTab === "tab3" && <StagesActifsAdmin />}
            {activeTab === "tab4" && <AccountManagement />}
            {activeTab === "tab5" && <RapportsAdmin />}
            {activeTab === "tab6" && <SoutenanceAdmin />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
