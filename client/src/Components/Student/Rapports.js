import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReport } from "../../JS/actions/rapportactions";
import { Card, ListGroup, Accordion, Button } from "react-bootstrap";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";

const Rapports = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userR.currentUser);
  const applications = useSelector((state) => state.companyR.applications);
  const allRapports = useSelector((state) => state.rapportR.reports);

  const allApplications = useMemo(
    () =>
      applications.filter(
        (application) =>
          application.status === "approved" &&
          application.student === currentUser._id
      ),
    [applications, currentUser._id]
  );

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleSubmit = (application) => {
    if (selectedFiles && selectedFiles.length > 0) {
      const newReportData = {
        student: currentUser._id,
        application: application,
        rapport_status: "review",
        message: "",
        files: selectedFiles,
      };
      const notificationData = {
        sender: "student report",
        toAdmin: false,
        student: currentUser._id,
        teacher_id: application.teacher_id || "",
        message: `Teacher: ${application?.teacher_first_name} ${
          application?.teacher_last_name
        }\nStudent: ${application.first_name} ${
          application.last_name
        }\nCompany: ${application.companyName}\nDate: ${moment(
          application.startDate
        ).format("MMMM Do YYYY")} - ${moment(application.endDate).format(
          "MMMM Do YYYY"
        )}`,
        timestamp: Date.now(),
        isEdited: true,
      };

      dispatch(createReport(newReportData, notificationData));
      setSelectedFiles([]);
    } else {
      alert("Please select one or more files to upload.");
    }
  };

  if (allApplications.length === 0) {
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
        Upload Reports
      </Card.Text>
      <hr />
      <Card.Body>
        {allApplications.map((application) => (
          <div key={application._id} className="col-md-12 mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{application.companyName}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Teacher: {application.teacher_first_name}{" "}
                  {application.teacher_last_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  Student: {application.first_name} {application.last_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  Start Date: <FaRegCalendarAlt />{" "}
                  {moment(application.startDate).format("YYYY-MM-DD")}
                  <br />
                  End Date: <FaRegCalendarAlt />{" "}
                  {moment(application.endDate).format("YYYY-MM-DD")}
                </ListGroup.Item>
                <ListGroup.Item>
                  Status:{" "}
                  {
                    allRapports.find(
                      (report) => report.application._id === application._id
                    )?.rapport_status
                  }
                </ListGroup.Item>
              </ListGroup>
              <Accordion className="mt-2 p-2" defaultActiveKey={0}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Comments</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      {allRapports
                        .filter(
                          (report) => report.application._id === application._id
                        )
                        .map((report) =>
                          report.message.slice(1).map((msg, index) => (
                            <ListGroup.Item key={index}>
                              {`${index + 1} ✎`} {msg}
                            </ListGroup.Item>
                          ))
                        )}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <Card.Body>
                {allRapports.find(
                  (report) => report.application._id === application._id
                )?.rapport_status === "approved" ? (
                  <Card bg="success" text="white">
                    <Card.Header as={"h3"}>
                      This report has been approved by your teacher.
                    </Card.Header>
                  </Card>
                ) : (
                  <>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      onChange={handleFileChange}
                    />
                    <Button
                      style={{
                        backgroundColor: "#6A62FA",
                        borderColor: "#6A62FA",
                        borderRadius: "30px",
                        marginTop: "20px",
                        width: "100%",
                      }}
                      onClick={() => handleSubmit(application)}
                    >
                      Upload Files
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default Rapports;
