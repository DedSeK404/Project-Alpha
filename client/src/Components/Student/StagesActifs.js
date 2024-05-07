import React from "react";
import { Table, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";

const StagesActifs = () => {
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allApplications = useSelector((state) => state.companyR.applications);
  const allRapports = useSelector((state) => state.rapportR.reports);

  const approvedApplications = allApplications.filter((application) => {
    // Check if all corresponding reports have a date_soutenance
    const allRapportsHaveDateSoutenance = allRapports.some(
      (rapport) =>
        rapport.application._id === application._id && rapport.date_soutenance
    );

    // Return true only if the application is approved and there's at least one corresponding approved report without a date_soutenance
    return (
      application.status === "approved" &&
      application.student === currentUser._id &&
      !allRapportsHaveDateSoutenance
    );
  });

  if (allApplications.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>There are no active Stages yet.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {approvedApplications.length === 0 ? (
        <Card>
          <Card.Body>
            <Card.Text>There are no active Stages yet.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
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
                {" "}
                <Table variant="light" striped bordered hover>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Company Name</th>
                      <th>Teacher</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedApplications.map((application) => (
                      <tr key={application._id}>
                        <td>{application.first_name}</td>
                        <td>{application.last_name}</td>
                        <td>{application.companyName}</td>
                        <td>
                          {application.teacher_first_name}{" "}
                          {application.teacher_last_name}
                        </td>
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
      )}
    </div>
  );
};

export default StagesActifs;
