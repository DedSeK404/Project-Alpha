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
import { updateNotification } from "../../JS/actions/notificationactions";

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
      isEdited: true,
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
    };
    dispatch(updateReport(reportId, updatedData, notificationData));
    setMessages({ ...messages, [reportId]: "" });
    dispatch(
      updateNotification({
        sender: "teacher_message",
        applicationStateTeacher: "message",
        isEdited: true,
        student: report.student,
        timestamp: Date.now(),
      })
    );
  };

  const handleApprove = (reportId, report) => {
    const notificationData = {
      sender: "teacher_approve",
      toAdmin: true,
      isEdited: true,
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
    };
    dispatch(
      updateReport(reportId, { rapport_status: "approved" }, notificationData)
    );
    dispatch(
      updateNotification({
        sender: "teacher_approve",
        applicationStateTeacher: "message",
        isEdited: true,
        student: report.student,
        toAdmin: true,
        timestamp: Date.now(),
      })
    );
  };

  const handleRevision = (reportId, report) => {
    const notificationData = {
      sender: "teacher_decline",
      toAdmin: false,
      isEdited: true,
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
    };
    dispatch(
      updateReport(reportId, { rapport_status: "revision" }, notificationData)
    );
    dispatch(
      updateNotification({
        sender: "teacher_decline",
        applicationStateTeacher: "message",
        isEdited: true,
        student: report.student,
        timestamp: Date.now(),
      })
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
            placeholder="Rechercher par nom d'étudiant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>

        {filteredRapports.length === 0 ? (
          <Card>
            <Card.Body>
              <Card.Text>Aucun rapport trouvé.</Card.Text>
            </Card.Body>
          </Card>
        ) : (
          filteredRapports.map((report) => (
            <Card className="mb-4" key={report._id} style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>
                  Nom de l'entreprise: {report.application?.companyName}
                </Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Date de début: <FaRegCalendarAlt />{" "}
                  {moment(report.application?.startDate).format("YYYY-MM-DD")}
                </ListGroup.Item>
                <ListGroup.Item>
                  Date de fin: <FaRegCalendarAlt />{" "}
                  {moment(report.application?.endDate).format("YYYY-MM-DD")}
                </ListGroup.Item>
                <ListGroup.Item>
                  Enseignant: {report.application?.teacher_first_name}{" "}
                  {report.application?.teacher_last_name}
                </ListGroup.Item>
                <ListGroup.Item>
                Étudiant: {report.application?.first_name}{" "}
                  {report.application?.last_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  Statut:{" "}
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
                        <td>Fichier {fileIndex + 1}</td>
                        <td>
                          <Button
                            variant="link"
                            onClick={() => handleFileDownload(report._id, file)}
                          >
                            <FaDownload /> Telecharger
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Accordion defaultActiveKey={null}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Commentaires</Accordion.Header>
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
                      La fin du stage est confirmée, la date de présentation est fixée.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ) : (
                  <>
                    {" "}
                    <Form.Group controlId={`message-${report._id}`}>
                      <Form.Label>Laisser un commentaire:</Form.Label>
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
                        Écrire un commentaire

                      </Button>
                      <Button
                        onClick={() => handleApprove(report._id, report)}
                        variant="secondary"
                        disabled={report.rapport_status === "approved"}
                      >
                        Approver
                      </Button>
                      <Button
                        disabled={report.rapport_status === "revision"}
                        onClick={() => handleRevision(report._id, report)}
                        variant="secondary"
                      >
                        Révision 
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
