import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Image } from "react-bootstrap";
import { logout } from "../../JS/actions/useraction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import StagesActifsTeacher from "../Teacher/StagesActifsTeacher";
import { getAllReports } from "../../JS/actions/rapportactions";
import { getallApplications } from "../../JS/actions/companyactions";
import RapportsTeacher from "../Teacher/RapportsTeacher";
import SoutenanceTeacher from "../Teacher/SoutenanceTeacher";
import Logo from "../LogIn/Logo.svg";
import circleLogo from "../LogIn/CircleLogo.svg";
import "./Dashboard.css";
import { FaGears } from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoCalendarOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { getAllNotifications } from "../../JS/actions/notificationactions";
import NotificationPanelTeacher from "../Teacher/NotificationPanelTeacher";

const TeacherDashboard = () => {
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allNotifications = useSelector(
    (state) => state.notificationR.notifications
  );
  useEffect(() => {
    dispatch(getAllReports());
    dispatch(getallApplications());
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
      notification.teacher_id === currentUser._id &&
      notification.isEdited &&
      notification.sender !== "teacher_message" &&
      notification.sender !== "teacher_approve" &&
      notification.sender !== "teacher_decline" &&
      notification.teacherStatus === "unread"
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
                  <FaGears size={30} />
                  <span> Stages Actifs</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="tab3">
                  <HiOutlineClipboardDocumentList size={30} />
                  <span> Rapports</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab4">
                  <IoCalendarOutline size={30} />
                  <span> Soutenances</span>
                </Nav.Link>
              </Nav.Item>
              <hr />
              <Nav.Item>
                <Nav.Link eventKey="tab5" onClick={handleLogout}>
                  <TbLogout2 size={30} />
                  <span> Log out</span>
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
            {activeTab === "tab1" && <NotificationPanelTeacher />}
            {activeTab === "tab2" && <StagesActifsTeacher />}
            {activeTab === "tab3" && <RapportsTeacher />}
            {activeTab === "tab4" && <SoutenanceTeacher />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
