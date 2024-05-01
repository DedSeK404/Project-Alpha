import React, { useState } from "react";
import { Form, Button, Table, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../JS/actions/companyactions";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";

const DemandeStage = () => {
  const dispatch = useDispatch();
  const allCompanies = useSelector((state) => state.companyR.companies);
  const currentUser = useSelector((state) => state.userR.currentUser);
  const allApplications = useSelector((state) => state.companyR.applications);
  const allAccounts = useSelector((state) => state.accountR.accounts);

  const [formData, setFormData] = useState({
    first_name: currentUser.first_name || "",
    last_name: currentUser.last_name || "",
    companyName: "",
    startDate: "",
    endDate: "",
    student: currentUser._id || "",
    teacher_first_name: "",
    teacher_last_name: "",
    teacher_address: "",
    status: "pending",
    teacher_id: "",
  });

  const handleApplicationSubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedStartDate = new Date(formData.startDate);
    if (selectedStartDate < currentDate) {
      alert("Start date cannot be in the past.");
      return;
    }

    dispatch(addApplication(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "teacher_first_name") {
      const selectedTeacher = allAccounts.find(
        (teacher) => `${teacher.first_name} ${teacher.last_name}` === value
      );
      setFormData({
        ...formData,
        teacher_first_name: selectedTeacher?.first_name || "",
        teacher_last_name: selectedTeacher?.last_name || "",
        teacher_id: selectedTeacher?._id || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <Container>
      <Card
        border="secondary"
        className="bg-dark text-white"
        style={{ marginBottom: "20px" }}
      >
        <Card.Text
          as="h2"
          className="m-3"
          style={{ fontFamily: "monospace", fontWeight: "600" }}
        >
          Apply for Stage
        </Card.Text>
        <hr />
        <Card.Body>
          <Card>
            <Card.Body>
              <Form onSubmit={handleApplicationSubmit}>
                <Form.Group controlId="companySelect">
                  <Form.Label>Select Company</Form.Label>
                  <Form.Control
                    as="select"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  >
                    <option value="">Select a company</option>

                    {allCompanies.length === 0 ? (
                      <option value="">There are no companies yet</option>
                    ) : (
                      allCompanies
                        .filter(
                          (company) => company.student === currentUser._id
                        )
                        .map((company) => (
                          <option key={company._id} value={company.companyName}>
                            {company.companyName}
                          </option>
                        ))
                    )}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="teacherSelect">
                  <Form.Label>Select Teacher</Form.Label>
                  <Form.Control
                    as="select"
                    name="teacher_first_name"
                    value={formData.teacher_first_name}
                    onChange={handleChange}
                  >
                    {formData.teacher_first_name ? (
                      <option
                        value={`${formData.teacher_first_name} ${formData.teacher_last_name}`}
                      >
                        {formData.teacher_first_name}{" "}
                        {formData.teacher_last_name}
                      </option>
                    ) : (
                      <option value="">Select a teacher</option>
                    )}
                    {allAccounts
                      .filter((account) => account.role === "teacher")
                      .map((teacher) =>
                        teacher.length === 0 ? (
                          <option value="">there are no teachers yet</option>
                        ) : (
                          <option
                            key={teacher._id}
                            value={`${teacher.first_name} ${teacher.last_name}`}
                          >
                            {teacher.first_name} {teacher.last_name}
                          </option>
                        )
                      )}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button
                  style={{
                    backgroundColor: "#6A62FA",
                    borderColor: "#6A62FA",
                    borderRadius: "30px",
                    width: "100%",
                    marginTop: "20px",
                  }}
                  variant="primary"
                  type="submit"
                >
                  Apply
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>

      <Card border="secondary" className="bg-dark text-white">
        <Card.Text
          as="h2"
          className="m-3"
          style={{ fontFamily: "monospace", fontWeight: "600" }}
        >
          {" "}
          All Applications
        </Card.Text>
        <hr />
        <Card.Body>
          <Card>
            <Card.Body>
              {" "}
              {allApplications.every(
                (application) => application.student !== currentUser._id
              ) ? (
                <Card>
                  <Card.Body>
                    <Card.Text>
                      You have not submitted any applications yet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                <Table variant="light" striped bordered hover>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Company Name</th>
                      <th>Teacher</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allApplications.map((application, index) => {
                      if (application.student === currentUser._id) {
                        return (
                          <tr key={index}>
                            <td>{application.first_name}</td>
                            <td>{application.last_name}</td>
                            <td>{application.companyName}</td>
                            <td>
                              {application.teacher_first_name}{" "}
                              {application.teacher_last_name}
                            </td>
                            <td>
                              <FaRegCalendarAlt />{" "}
                              {moment(application.startDate).format(
                                "MMMM Do YYYY"
                              )}
                            </td>
                            <td>
                              <FaRegCalendarAlt />{" "}
                              {moment(application.endDate).format(
                                "MMMM Do YYYY"
                              )}
                            </td>
                            <td
                              style={{
                                color:
                                  application.status === "pending"
                                    ? "gray"
                                    : application.status === "approved"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {application.status}
                            </td>
                          </tr>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DemandeStage;
