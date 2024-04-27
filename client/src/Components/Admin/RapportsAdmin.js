import React, { useMemo, useState } from "react";
import { Card, ListGroup, Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateReport } from "../../JS/actions/rapportactions";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./datepicker.css"
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

  const handleRevision = (reportId) => {
    dispatch(
      updateReport(reportId, { date_soutenance: selectedDates[reportId] })
    );
  };

  if (filteredReports.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>There are no reports yet.</Card.Text>
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
                      Teacher: {report.application.teacher_first_name}{" "}
                      {report.application.teacher_last_name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Student: {report.application.first_name}{" "}
                      {report.application.last_name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Start Date: <FaRegCalendarAlt />{" "}
                      {moment(report.application.startDate).format(
                        "YYYY-MM-DD"
                      )}
                      <br />
                      End Date: <FaRegCalendarAlt />{" "}
                      {moment(report.application.endDate).format("YYYY-MM-DD")}
                    </ListGroup.Item>
                    <blockquote
                      style={{ padding: "10px" }}
                      className="blockquote mb-0"
                    >
                      <p>Status:</p>
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
                  <Card.Header>Choose Date for Presentation</Card.Header>
                  <Card.Body>
                    <DatePicker
                  
                      selected={selectedDates[report._id] || null}
                      onChange={(date) => handleDateChange(date, report._id)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a date"
                    />
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
                      onClick={() => handleRevision(report._id)}
                    >
                      Set Date
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
