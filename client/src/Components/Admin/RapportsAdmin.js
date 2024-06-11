import React, { useMemo, useState } from "react";
import { Card, ListGroup, Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateReport } from "../../JS/actions/rapportactions";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./datepicker.css";
import { updateNotification } from "../../JS/actions/notificationactions";
const RapportsAdmin = () => {
  const dispatch = useDispatch();
  const allReports = useSelector((state) => state.rapportR.reports);

  const [selectedDates, setSelectedDates] = useState({});

  const filteredReports = useMemo(
    () => allReports.filter((report) => report.rapport_status === "approved"),
    [allReports]
  );

  const handleDateChange = (date, reportId) => {
    setSelectedDates({ ...selectedDates, [reportId]: date });
  };

  const handleRevision = (reportId, report) => {
    const notificationData = {
      sender: "admin_soutenance",
      toAdmin: false,
      isEdited: true,
      student: report.student,
      teacher_id: report.application.teacher_id,
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
      updateReport(
        reportId,
        { date_soutenance: selectedDates[reportId] },
        notificationData
      )
    );
    dispatch(
      updateNotification({
        sender: "admin_soutenance",
        isEdited: true,
        student: report.student,
        timestamp: Date.now(),
        toAdmin: false,
        teacher_id: report.application.teacher_id,
      })
    );
  };

  if (filteredReports.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Il n'y a pas encore de rapports.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

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
        <div className="row">
          {filteredReports.map((report) => (
            <Row className="mt-4" key={report._id}>
              <Col key={report._id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{report.application.companyName}</Card.Title>
                    <Card.Text></Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      Enseignant: {report.application.teacher_first_name}{" "}
                      {report.application.teacher_last_name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Étudiant: {report.application.first_name}{" "}
                      {report.application.last_name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Date de début: <FaRegCalendarAlt />{" "}
                      {moment(report.application.startDate).format(
                        "YYYY-MM-DD"
                      )}
                      <br />
                      Date de fin: <FaRegCalendarAlt />{" "}
                      {moment(report.application.endDate).format("YYYY-MM-DD")}
                    </ListGroup.Item>
                    <blockquote
                      style={{ padding: "10px" }}
                      className="blockquote mb-0"
                    >
                      <p>Statut:</p>
                      <footer
                        style={{ color: "green" }}
                        className="blockquote-footer"
                      >
                        {report.rapport_status}
                      </footer>
                    </blockquote>
                  </ListGroup>
                </Card>
              </Col>
              <Col key={report._id + 1}>
                <Card style={{ height: "100%" }}>
                  <Card.Header>
                    Choisissez la date pour la présentation
                  </Card.Header>
                  <Card.Body>
                    <DatePicker
                      selected={selectedDates[report._id] || null}
                      onChange={(date) => handleDateChange(date, report._id)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a date"
                    />
                    {report.date_soutenance && (
                      <h3>
                        <span>La date de l'application a été fixée le:</span>{" "}
                        {moment(report.date_soutenance).format("YYYY-MM-DD")}
                      </h3>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      style={{
                        backgroundColor: "#6A62FA",
                        borderColor: "#6A62FA",
                        borderRadius: "30px",
                        width: "100%",
                      }}
                      variant="primary"
                      onClick={() => handleRevision(report._id, report)}
                    >
                      Définir la date
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RapportsAdmin;
