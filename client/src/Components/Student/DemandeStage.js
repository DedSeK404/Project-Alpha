import React, { useState } from "react";
import { Form, Button, Table, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../JS/actions/companyactions";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";
import { updateNotification } from "../../JS/actions/notificationactions";

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

  const [notificationData, setNotificationData] = useState({
    sender: `${currentUser.first_name} ${currentUser.last_name}`,
    toAdmin: true,
    student: "",
    teacher_id: "",
    message: "",
    timestamp: Date.now(),
  });

  const handleApplicationSubmit = (e) => {
    e.preventDefault();

    // Define the required fields
    const requiredFields = [
      "companyName",
      "file",
      "startDate",
      "endDate",
      "teacher_id",
    ];

    // Check if any of the required fields are empty
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`${field} cannot be empty`);
        return;
      }
    }

    const currentDate = new Date();
    const selectedStartDate = new Date(formData.startDate);
    if (selectedStartDate < currentDate) {
      alert("Start date cannot be in the past.");
      return;
    }

    dispatch(addApplication(formData, notificationData));
    dispatch(updateNotification({ ...notificationData, hideS: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "teacher_first_name") {
      const selectedTeacher = allAccounts.find(
        (teacher) => `${teacher.first_name} ${teacher.last_name}` === value
      );
      setFormData((prevState) => ({
        ...prevState,
        teacher_first_name: selectedTeacher?.first_name || "",
        teacher_last_name: selectedTeacher?.last_name || "",
        teacher_id: selectedTeacher?._id || "",
      }));
      setNotificationData((prevState) => ({
        ...prevState,
        teacher_id: selectedTeacher?._id || "",
        student: formData.student,
        message: `Teacher: ${selectedTeacher?.first_name} ${selectedTeacher?.last_name}\nStudent: ${currentUser.first_name} ${currentUser.last_name}\nCompany: ${formData.companyName}\nDate: ${formData.startDate} - ${formData.endDate}`,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      // Construct message using current values
      const message = `Teacher: ${formData.teacher_first_name} ${
        formData.teacher_last_name
      }\nStudent: ${currentUser.first_name} ${
        currentUser.last_name
      }\nCompany: ${formData.companyName}\nDate: ${
        name === "startDate"
          ? value + " - " + formData.endDate
          : formData.startDate + " - " + value
      }`;

      // Update notificationData for startDate and endDate
      if (name === "startDate" || name === "endDate") {
        setNotificationData((prevState) => ({
          ...prevState,
          message: message,
        }));
      }
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
          Postuler pour un stage
        </Card.Text>
        <hr />
        <Card.Body>
          <Card>
            <Card.Body>
              <Form onSubmit={handleApplicationSubmit}>
                <Form.Group controlId="companySelect">
                  <Form.Label>Sélectionner une entreprise</Form.Label>
                  <Form.Control
                    as="select"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner une entreprise</option>

                    {allCompanies.length === 0 ? (
                      <option value="">Aucune entreprise n'a été ajoutée pour le moment </option>
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
                  <Form.Label>Sélectionner un/une enseignant(e)</Form.Label>
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
                      <option value="">Sélectionner un/une enseignant(e)</option>
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
                  <Form.Label>Date de début</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="endDate">
                  <Form.Label>Date de fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="file">
                  <Form.Label>Importer un fichier</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={(e) =>
                      setFormData({ ...formData, file: e.target.files[0] })
                    }
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
                  Postuler 
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
          Liste de toutes les applications
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
                    Vous n'avez envoyé aucune demande pour le moment.
                    </Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                <Table variant="light" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nom de l'entreprise </th>
                      <th>Étudiant</th>
                      <th>Enseignant</th>
                      <th>Date de début</th>
                      <th>Date de fin</th>
                      <th>Statut</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allApplications.map((application, index) => {
                      if (application.student === currentUser._id) {
                        return (
                          <tr key={index}>
                            <td>{application.companyName}</td>
                            <td>
                              {application.first_name} {application.last_name}
                            </td>

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
                              {application.status
                                ? application.status
                                : "pending"}
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
