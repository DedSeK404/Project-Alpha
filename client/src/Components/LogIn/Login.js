import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import CircleLogo from "./CircleLogo.svg";
import SignIn from "./SignIn/SignIn";
import Signup from "./SignUp/Signup";

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <div
      style={{
        backgroundColor: "#242527",
        height: "fit-content",
        minHeight: "100vh",
      }}
    >
      <Container style={{ minHeight: "100vh" }}>
        <Row
          className="justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Col
            style={{
              alignSelf: "center",
            }}
            md={6}
          >
            <Image width={"80%"} src={CircleLogo} fluid />
          </Col>
          <Col
            style={{
              alignSelf: "center",
            }}
            md={6}
          >
            <div
              style={{ backgroundColor: "#3A3B3D" }}
              className="home-content"
            >
              {showLogin && (
                <div
                  style={{
                    height: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:"space-between",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "85vh",
                  }}
                >
                  <h2 style={{ color: "white", fontWeight: "600" }}>Connection</h2>
                  <SignIn />
                  <p className="text-center mt-3" style={{ color: "white" }}>
                  Si vous n'avez pas de compte, cliquez ici pour {""}
                    <span
                      className="highlight"
                      style={{ color: "#6A62FA", fontSize: "larger" }}
                      onClick={handleSignupClick}
                    >
                      créer un compte
                    </span>
                  </p>
                </div>
              )}

              {showSignup && (
                <div
                  style={{
                    height: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:"space-between",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "85vh",
                  }}
                >
                  <h2 style={{ color: "white", fontWeight: "600" }}>S'inscrire</h2>
                  <Signup />
                  <p style={{ color: "white" }}>
                  Si vous avez déjà un compte, cliquez ici pour vous {""}
                    <span
                      style={{ color: "#6A62FA", fontSize: "larger" }}
                      className="highlight"
                      onClick={handleLoginClick}
                    >
                      connecter.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
