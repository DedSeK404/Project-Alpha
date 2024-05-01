import React from "react";
import { Table, Card } from "react-bootstrap";
import moment from "moment";
import { useSelector } from "react-redux";
import { FaRegCalendarAlt } from "react-icons/fa";

const SoutenanceStudent = () => {
  const allRapports = useSelector((state) => state.rapportR.reports);
  const currentUser = useSelector((state) => state.userR.currentUser);

  const rapportsWithDateSoutenance = allRapports.filter(
    (report) =>
      report.rapport_status === "approved" &&
      report.date_soutenance !== null &&
      report.date_soutenance !== undefined &&
      report.application.student === currentUser._id
  );

  if (rapportsWithDateSoutenance.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>There are no presentations yet.</Card.Text>
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
        Soutenance
      </Card.Text>
      <hr />
      <Card.Body>
        <Card>
          <Card.Body>
            {" "}
            <Table variant="light" striped bordered hover>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Student</th>
                  <th>Teacher</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Rapport Status</th>
                  <th>Date Soutenance</th>
                </tr>
              </thead>
              <tbody>
                {rapportsWithDateSoutenance.map((report) => (
                  <tr key={report._id}>
                    <td>{report.application.companyName}</td>
                    <td>
                      {report.application.first_name}{" "}
                      {report.application.last_name}
                    </td>
                    <td>
                      {report.application.teacher_first_name}{" "}
                      {report.application.teacher_last_name}
                    </td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(report.application.startDate).format(
                        "YYYY-MM-DD"
                      )}
                    </td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(report.application.endDate).format("YYYY-MM-DD")}
                    </td>
                    <td style={{ color: "green" }}>{report.rapport_status}</td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(report.date_soutenance).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default SoutenanceStudent;
