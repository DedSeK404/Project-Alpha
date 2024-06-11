import React, { useState } from "react";
import { Button, Table, Card, Offcanvas } from "react-bootstrap";
import AccountModal from "./AccountModal";
import { useSelector } from "react-redux";

const AccountManagement = () => {
  const allAccounts = useSelector((state) => state.accountR.accounts);
  const teachers = allAccounts.filter((account) => account.role === "teacher");

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  if (teachers.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Il n'y a pas encore de comptes d'enseignant.</Card.Text>
        </Card.Body>
      </Card>
    );
  }
  return (
    <>
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
          Enseignants
        </Card.Text>
        <hr />
        <Card.Body>
          <Card>
            <Card.Body>
              <Table variant="light" striped bordered hover>
                <thead>
                  <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>{teacher.first_name}</td>
                      <td>{teacher.last_name}</td>
                      <td>{teacher.email}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                style={{
                  backgroundColor: "#6A62FA",
                  borderColor: "#6A62FA",
                  borderRadius: "30px",
                  width: "100%",
                }}
                onClick={handleShowModal}
              >
                Ajouter un compte enseignant
              </Button>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>

      <Offcanvas
        style={{ width: "40%" }}
        show={showModal}
        onHide={handleCloseModal}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title
            style={{
              color: "#6A62FA",
              fontWeight: "500",
              fontSize: "2rem",
            }}
          >
            Ajouter un compte enseignant
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AccountModal />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AccountManagement;
