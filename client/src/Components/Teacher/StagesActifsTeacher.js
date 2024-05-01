import React from "react";
import { Table, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";

const StagesActifsTeacher = () => {
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allApplications = useSelector((state) => state.companyR.applications);
  const allRapports = useSelector((state) => state.rapportR.reports);

  const approvedApplications = allApplications.filter((application) => {
    // Check if there's no corresponding report with non-empty 'date_soutenance' for the application
    const hasReportWithDateSoutenance = allRapports.some(
      (rapport) =>
        rapport.application._id === application._id &&
        !rapport.date_soutenance 
    );

    // Return true only if the application is approved and there's no corresponding report with 'date_soutenance'
    return (
      application.status === "approved" &&
      currentUser._id === application.teacher_id &&
      hasReportWithDateSoutenance
    );
  });

  if (approvedApplications.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>There are no active Stages yet.</Card.Text>
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
        Stages Actifs
      </Card.Text>
      <hr />
      <Card.Body>
        <Card>
          <Card.Body>
            <Table variant="light" striped bordered hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Company Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {approvedApplications.map((application, index) => (
                  <tr key={index}>
                    <td>{application.first_name}</td>
                    <td>{application.last_name}</td>
                    <td>{application.companyName}</td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(application.startDate).format("MMMM Do YYYY")}
                    </td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(application.endDate).format("MMMM Do YYYY")}
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

export default StagesActifsTeacher;