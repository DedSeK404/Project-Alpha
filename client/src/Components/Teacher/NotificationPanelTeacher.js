import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Container,
  Col,
  Row,
  Alert,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { markNotificationAsRead } from "../../JS/actions/notificationactions";

const NotificationPanelTeacher = () => {
  const dispatch = useDispatch();
  const allNotifications = useSelector(
    (state) => state.notificationR.notifications
  );
  const currentUser = useSelector((state) => state.userR.currentUser);
  const notifications = allNotifications.filter(
    (notification) =>
      notification.teacher_id === currentUser._id &&
      notification.isEdited &&
      notification.sender !== "teacher_message" &&
      notification.sender !== "teacher_approve" &&
      notification.sender !== "teacher_decline"
  );

  const handleNotificationClick = (notificationId) => {
    dispatch(
      markNotificationAsRead({ notificationId, role: currentUser.role })
    );
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click on a notification to archive it.
    </Tooltip>
  );
 
  return (
    <>
      {notifications.length === 0 ? (
        <Card>
          <Card.Body>
            <Card.Text>You currently have no notifications.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Card border="secondary" className="bg-dark text-white">
          <Container className="container mt-4">
            <Row>
              <Col sm={6}>
                <Card.Text
                  as="h2"
                  className="m-3"
                  style={{ fontFamily: "monospace", fontWeight: "600" }}
                >
                  New Notifications
                </Card.Text>
                <OverlayTrigger
                  placement="top-end"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
                  {notifications.filter(
                      (notification) => notification.teacherStatus === "unread"
                    ).length === 0 && (
                      <Card>
                        <Card.Header>No new notifications</Card.Header>
                      </Card>
                    )}
                    {notifications
                      .filter(
                        (notification) =>
                          notification.teacherStatus === "unread"
                      )
                      .map((notification) => (
                        <Alert
                          key={notification._id}
                          variant={
                            notification.sender === "admin_approved" ||
                            notification.sender === "student report"
                              ? "success"
                              : notification.sender === "admin_declined"
                              ? "danger"
                              : "primary"
                          }
                          onClick={() =>
                            handleNotificationClick(notification._id)
                          }
                        >
                          <Alert.Heading>
                            <strong>
                              {notification.sender === "admin_approved" ||
                              notification.sender === "admin_declined"
                                ? "The admin"
                                : notification.sender === "student report"
                                ? "A student"
                                : notification.sender === "admin_soutenance"
                                ? "The admin"
                                : ""}
                            </strong>{" "}
                            {notification.sender === "admin_approved"
                              ? "Has approved this application"
                              : notification.sender === "admin_declined"
                              ? "Has declined this application"
                              : notification.sender === "student report"
                              ? "has updated this report"
                              : notification.sender === "admin_soutenance"
                              ? "Has set a presentation date for this application"
                              : ""}
                          </Alert.Heading>

                          <div
                            className={
                              notification.sender === "admin_approved" ||
                              notification.sender === "student report"
                                ? "alert alert-success"
                                : notification.sender === "admin_declined"
                                ? "alert alert-danger"
                                : notification.sender === "admin_soutenance"
                                ? "alert alert-primary"
                                : ""
                            }
                            role="alert"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {notification.message}
                          </div>

                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6c757d",
                              textAlign: "right",
                            }}
                          >
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </Alert>
                      ))}
                  </div>
                </OverlayTrigger>
              </Col>
              <Col sm={6}>
                <Card.Text
                  as="h2"
                  className="m-3"
                  style={{ fontFamily: "monospace", fontWeight: "600" }}
                >
                  Notification History
                </Card.Text>

                <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
                  {notifications
                    .filter(
                      (notification) => notification.teacherStatus === "read"
                    )
                    .map((notification) => (
                      <Alert
                        key={notification._id}
                        variant="secondary"
                        onClick={() =>
                          handleNotificationClick(notification._id)
                        }
                      >
                        <Alert.Heading>
                        <strong>
                              {notification.sender === "admin_approved" ||
                              notification.sender === "admin_declined"
                                ? "The admin"
                                : notification.sender === "student report"
                                ? "A student"
                                : notification.sender === "admin_soutenance"
                                ? "The admin"
                                : ""} 
                            </strong>{" "}
                            {notification.sender === "admin_approved"
                              ? "Has approved this application"
                              : notification.sender === "admin_declined"
                              ? "Has declined this application"
                              : notification.sender === "student report"
                              ? "has updated this report"
                              : notification.sender === "admin_soutenance"
                              ? "Has set a presentation date for this application"
                              : ""}
                        </Alert.Heading>

                        <div
                          className="alert alert-secondary"
                          role="alert"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {notification.message}
                        </div>

                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            textAlign: "right",
                          }}
                        >
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </Alert>
                    ))}
                </div>
              </Col>
            </Row>
          </Container>
        </Card>
      )}
    </>
  );
};

export default NotificationPanelTeacher;
