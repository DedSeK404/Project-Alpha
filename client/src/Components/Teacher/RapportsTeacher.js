import React, { useState } from "react";
import {
  Card,
  ListGroup,
  Button,
  Table,
  Form,
  Accordion,
  ButtonGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { updateReport, downloadReport } from "../../JS/actions/rapportactions";
import { FaRegCalendarAlt, FaDownload } from "react-icons/fa";

const RapportsTeacher = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allRapports = useSelector((state) => state.rapportR.reports);

  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState({});

  const handleMessageChange = (reportId, message) => {
    setMessages({ ...messages, [reportId]: message });
  };

  const handleUpdateMessage = (reportId, report) => {
    const updatedData = {
      message: messages[reportId],
    };
  
    const notificationData = {
      sender: "teacher_message",
      toAdmin: false,
      isEdited:true,
      teacher_id: currentUser._id,
      student: report.student,
      message: `Teacher: ${report.application.teacher_first_name} ${
        report.application.teacher_last_name
      }\nStudent: ${report.application.first_name} ${
        report.application.last_name
      }\nCompany: ${report.application.companyName}\nDate: ${moment(
        report.application.startDate
      ).format("MMMM Do YYYY")} - ${moment(report.application.endDate).format(
        "MMMM Do YYYY"
      )}`,
      timestamp: Date.now(),
      isEdited: true,
    };
    dispatch(updateReport(reportId, updatedData, notificationData));
    setMessages({ ...messages, [reportId]: "" });
  };

  const handleApprove = (reportId,report) => {
    const notificationData = {
      sender: "teacher_approve",
      toAdmin: true,
      isEdited:true,
      teacher_id: currentUser._id,
      student: report.student,
      message: `Teacher: ${report.application.teacher_first_name} ${
        report.application.teacher_last_name
      }\nStudent: ${report.application.first_name} ${
        report.application.last_name
      }\nCompany: ${report.application.companyName}\nDate: ${moment(
        report.application.startDate
      ).format("MMMM Do YYYY")} - ${moment(report.application.endDate).format(
        "MMMM Do YYYY"
      )}`,
      timestamp: Date.now(),
      isEdited: true,
    };
    dispatch(
      updateReport(reportId, { rapport_status: "approved" }, notificationData)
    );
  };

  const handleRevision = (reportId,report) => {
    const notificationData = {
      sender: "teacher_decline",
      toAdmin: false,
      isEdited:true,
      teacher_id: currentUser._id,
      student: report.student,
      message: `Teacher: ${report.application.teacher_first_name} ${
        report.application.teacher_last_name
      }\nStudent: ${report.application.first_name} ${
        report.application.last_name
      }\nCompany: ${report.application.companyName}\nDate: ${moment(
        report.application.startDate
      ).format("MMMM Do YYYY")} - ${moment(report.application.endDate).format(
        "MMMM Do YYYY"
      )}`,
      timestamp: Date.now(),
      isEdited: true,
    };
    dispatch(
      updateReport(reportId, { rapport_status: "revision" }, notificationData)
    );
  };

  const handleFileDownload = (reportId, filename) => {
    dispatch(downloadReport(reportId, filename)); // Dispatch downloadReport action
  };

  const filteredRapports = allRapports.filter(
    (report) =>
      report.application.teacher_id === currentUser._id &&
      (report.application.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        report.application.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  return (
    <Card
      border="secondary"
      className="bg-dark text-white"
      style={{ minHeight: "90vh" }}
    >
      <Card.Text
        as="h2"
        className="m-3"
        style={{ fontFamily: "monospace", fontWeight: "600" }}
      >
        Rapports
      </Card.Text>
      <hr />
      <Card.Body>
        {/* Search Bar */}
        <Form.Group className="mb-4" controlId="searchQuery">
          <Form.Control
            type="text"
            placeholder="Search by student name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>

        {filteredRapports.length === 0 ? (
          <Card>
            <Card.Body>
              <Card.Text>No rapports found.</Card.Text>
            </Card.Body>
          </Card>
        ) : (
          filteredRapports.map((report) => (
            <Card className="mb-4" key={report._id} style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>
                  Company Name {report.application?.companyName}
                </Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Start Date: <FaRegCalendarAlt />{" "}
                  {moment(report.application?.startDate).format("YYYY-MM-DD")}
                </ListGroup.Item>
                <ListGroup.Item>
                  End Date: <FaRegCalendarAlt />{" "}
                  {moment(report.application?.endDate).format("YYYY-MM-DD")}
                </ListGroup.Item>
                <ListGroup.Item>
                  Teacher: {report.application?.teacher_first_name}{" "}
                  {report.application?.teacher_last_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  Student: {report.application?.first_name}{" "}
                  {report.application?.last_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  Status:{" "}
                  <span
                    style={{
                      color:
                        report.rapport_status === "approved"
                          ? "green"
                          : "orange",
                    }}
                  >
                    {report.rapport_status}
                  </span>
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Table variant="light" bordered striped responsive>
                  <tbody>
                    {report.files.map((file, fileIndex) => (
                      <tr key={fileIndex}>
                        <td>File {fileIndex + 1}</td>
                        <td>
                          <Button
                            variant="link"
                            onClick={() => handleFileDownload(report._id, file)}
                          >
                            <FaDownload /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Accordion defaultActiveKey={null}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Comments</Accordion.Header>
                    <Accordion.Body>
                      <ListGroup>
                        {report.message.slice(1).map((msg, index) => (
                          <ListGroup.Item key={index}>
                            {`${index + 1} ✎`} {msg}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {report.date_soutenance ? (
                  <Card bg="secondary" text="white" className="mt-3">
                    <Card.Body>
                      <Card.Text as={"h3"}>
                        Stage completion confirmed, presentation date scheduled
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ) : (
                  <>
                    {" "}
                    <Form.Group controlId={`message-${report._id}`}>
                      <Form.Label>Leave a comment:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={messages[report._id]}
                        onChange={(e) =>
                          handleMessageChange(report._id, e.target.value)
                        }
                      />
                    </Form.Group>
                    <ButtonGroup
                      style={{ width: "100%", marginTop: "10px" }}
                      aria-label="Basic example"
                    >
                      <Button
                        onClick={() => handleUpdateMessage(report._id, report)}
                        variant="secondary"
                      >
                        Add Comment
                      </Button>
                      <Button
                        onClick={() => handleApprove(report._id, report)}
                        variant="secondary"
                        disabled={report.rapport_status === "approved"}
                      >
                        Approve
                      </Button>
                      <Button
                        disabled={report.rapport_status === "revision"}
                        onClick={() => handleRevision(report._id, report)}
                        variant="secondary"
                      >
                        Revision
                      </Button>
                    </ButtonGroup>
                  </>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default RapportsTeacher;
