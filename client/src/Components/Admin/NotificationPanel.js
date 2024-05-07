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

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allNotifications = useSelector(
    (state) => state.notificationR.notifications
  );

  const notifications = allNotifications.filter(
    (notification) => notification.toAdmin === true
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
                      (notification) => notification.adminStatus === "unread"
                    ).length === 0 && (
                      <Card>
                        <Card.Header>No new notifications</Card.Header>
                      </Card>
                    )}
                    {notifications
                      .filter(
                        (notification) => notification.adminStatus === "unread"
                      )
                      .map((notification) => (
                        <Alert
                          key={notification._id}
                          variant="success"
                          onClick={() =>
                            handleNotificationClick(notification._id)
                          }
                        >
                          <Alert.Heading>
                            <strong>
                              {notification.sender === "teacher_approve"
                                ? "A teacher"
                                : notification.sender}
                            </strong>{" "}
                            {notification.sender === "teacher_approve"
                              ? "has approved the report of this application"
                              : "has posted a new application"}
                          </Alert.Heading>

                          <div
                            className="alert alert-success"
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
                      (notification) => notification.adminStatus === "read"
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
                            {notification.sender === "teacher_approve"
                              ? "A teacher"
                              : notification.sender}
                          </strong>{" "}
                          {notification.sender === "teacher_approve"
                            ? "has approved the report of this application"
                            : "has posted a new application"}
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

export default NotificationPanel;
