import React, { useState } from "react";
import { Form, Button, Table, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addcompany, deleteCompany } from "../../JS/actions/companyactions";

const AjouterEntreprise = () => {
  const dispatch = useDispatch();
  const allCompanies = useSelector((state) => state.companyR.companies);
  const currentUser = useSelector((state) => state.userR.currentUser);
  const [addCompany, setAddCompany] = useState({
    student: currentUser._id,
    companyName: "",
  });

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    dispatch(addcompany(addCompany));
    setAddCompany({ ...addCompany, companyName: "" }); 
  };

  const handleDelete = (companyId) => {
    dispatch(deleteCompany(companyId));
  };

  return (
    <Container>
      <Card border="secondary" className="bg-dark text-white mb-4">
        <Card.Text
          as="h2"
          className="m-3"
          style={{ fontFamily: "monospace", fontWeight: "600" }}
        >
          Ajouter une entreprise
        </Card.Text>
        <hr />
        <Card.Body>
          <Card>
            <Card.Body>
              {" "}
              <Form onSubmit={handleCompanySubmit}>
                <Form.Group controlId="companyName">
                  <Form.Label>Nom de l'entreprise</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez le nom de l'entreprise"
                    value={addCompany.companyName}
                    onChange={(e) =>
                      setAddCompany({
                        ...addCompany,
                        companyName: e.target.value,
                      })
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
                  Ajouter entreprise
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
          Liste des entreprises 
        </Card.Text>
        <hr />
        <Card.Body>
          {allCompanies.filter((company) => company.student === currentUser._id)
            .length === 0 ? (
            <Card>
              <Card.Body>
                <Card.Text>Il n'y a aucune entreprise pour le moment.
</Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body>
                <Table variant="light" striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom de l'entreprise</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCompanies
                      .filter((company) => company.student === currentUser._id)
                      .map((company, index) => (
                        <tr key={company._id}>
                          <td>{index + 1}</td>
                          <td>{company.companyName}</td>
                          <td>
                            <Button
                              style={{ width: "100%" }}
                              variant="danger"
                              onClick={() => handleDelete(company._id)}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AjouterEntreprise;
