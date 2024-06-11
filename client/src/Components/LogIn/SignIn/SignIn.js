import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignIn.css";
import { loginUser } from "../../../JS/actions/useraction";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      dispatch(loginUser(formData, navigate));
    }
    setValidated(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="login-form">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                <Form.Label style={{ color: "gray" }}>Password</Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
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
                    onClick={togglePasswordVisibility}
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

              <Button
                style={{
                  backgroundColor: "#6A62FA",
                  borderColor: "#6A62FA",
                  borderRadius: "30px",
                }}
                variant="primary"
                type="submit"
                className="btn-block"
              >
                Connection
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
