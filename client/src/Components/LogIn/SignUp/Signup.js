import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addUser } from "../../../JS/actions/useraction";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      e.stopPropagation();
    } else {
      dispatch(addUser(formData));
      setValidated(true);
    }
    setValidated(true);
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Container>
      <Row >
        <Col md={12}>
          <div className="signup-form">
            {passwordsMatch === false && (
              <Alert variant="danger" className="text-center">
              Les mots de passe ne correspondent pas.
              </Alert>
            )}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="first_name">
                <Form.Label style={{ color: "gray" }}>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez le prénom"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="custom-background custom-placeholder"
                  style={{ color: "gray" }}
                />
                <Form.Control.Feedback type="invalid">
                Veuillez entrer votre prénom.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="last_name">
                <Form.Label style={{ color: "gray" }}>Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter le Nom"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="custom-background custom-placeholder"
                  style={{ color: "gray" }}
                />
                <Form.Control.Feedback type="invalid">
                Veuillez entrer votre nom.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label style={{ color: "gray" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Entrez l'adresse e-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="custom-background custom-placeholder"
                  style={{ color: "gray" }}
                />
                <Form.Control.Feedback type="invalid">
                Veuillez entrer une adresse e-mail valide.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label style={{ color: "gray" }}>Mot de passe</Form.Label>
                <div
                  style={{ display: "flex", gap: "10px" }}
                  className="password-input"
                >
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez le mot de passe"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="custom-background custom-placeholder"
                    style={{ color: "gray" }}
                  />
                  <Button
                    variant="light"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility("password")}
                    style={{
                      color: "white",
                      backgroundColor: "#6A62FA",
                      borderColor: "#6A62FA",
                    }}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                Veuillez entrer un mot de passe.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label style={{ color: "gray" }}>Confirmer le mot de passe</Form.Label>
                <div
                  style={{ display: "flex", gap: "10px" }}
                  className="password-input"
                >
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="custom-background custom-placeholder"
                    style={{ color: "gray" }}
                  />
                  <Button
                    variant="light"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    style={{
                      color: "white",
                      backgroundColor: "#6A62FA",
                      borderColor: "#6A62FA",
                    }}
                  >
                    {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {passwordsMatch
                    ? "Passwords do not match."
                    : "Please confirm your password."}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                style={{
                  backgroundColor: "#6A62FA",
                  borderColor: "#6A62FA",
                  borderRadius: "30px",
                  marginTop: "20px",
                }}
                variant="primary"
                type="submit"
                className="btn-block"
              >
                S'inscrire
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
