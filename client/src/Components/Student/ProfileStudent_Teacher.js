import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import {
  updateProfilePicture,
  updateUser,
} from "../../JS/actions/accountactions";
import { BsPencilSquare, BsEye, BsEyeSlash } from "react-icons/bs";
import moment from "moment";

const ProfileStudent_Teacher = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userR.currentUser);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: currentUser.first_name,
    last_name: currentUser.last_name,
    email: currentUser.email,
    id: currentUser._id,
    birthDate: "",
    password: "",
    confirmPassword: "",
    adress: "",
    phone: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check if passwords match
    if (name === "confirmPassword") {
      setPasswordsMatch(formData.password === value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if passwords match before submitting
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    dispatch(updateUser(formData));
    setEditMode(false);
  };
  // State for managing the new profile photo
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  // Function to handle changing the profile photo
  const handleProfilePhotoChange = (e) => {
    setNewProfilePhoto(e.target.files[0]);
  };
  const [editPhotoMode, setEditPhotoMode] = useState(false);
  // Function to toggle edit mode for photo
  const toggleEditMode = () => {
    setEditPhotoMode(!editPhotoMode);
  };

  const handleSubmitPhoto = (e) => {
    e.preventDefault();

    dispatch(updateProfilePicture(currentUser._id, newProfilePhoto));

    setEditPhotoMode(false);
  };
  const defaultPic =
    "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg";

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    }
    if (field === "confirmPassword") {
      setShowPassword2(!showPassword2);
    }
  };
  return (
    <Container>
      <Card
        border="secondary"
        className="bg-dark text-white"
        style={{ marginBottom: "20px" }}
      >
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="text-center mb-4">
                <Image
                  src={
                    currentUser.img === defaultPic
                      ? defaultPic
                      : `http://localhost:4500/${currentUser.img}`
                  }
                  alt="Profile"
                  roundedCircle
                  style={{
                    width: "150px",
                    height: "150px",
                    marginLeft: "40px",
                  }}
                />
                <BsPencilSquare
                  style={{
                    cursor: "pointer",
                    marginLeft: "20px",
                  }}
                  size={20}
                  onClick={toggleEditMode}
                />
                <h2>{`${currentUser.first_name} ${currentUser.last_name}`}</h2>
              </div>
              {editPhotoMode && (
                <Form onSubmit={handleSubmitPhoto}>
                  <hr />
                  <Form.Group controlId="formProfilePhoto">
                    <Form.Control
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
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
                    Enregistrer les modifications
                  </Button>
                </Form>
              )}

              <hr />
              <div className="mb-4">
                <h4 className="mb-4">Détails du profil </h4>

                <Card>
                  <Card.Body>
                    <p>
                      <strong>E-mail:</strong>{" "}
                      {currentUser.email
                        ? currentUser.email
                        : "Veuillez ajouter une adresse e-mail"}
                    </p>
                    <hr />
                    <p>
                      <strong>Date de naissance:</strong>{" "}
                      {moment(currentUser.birthDate).format("MMMM Do YYYY") ? (
                        moment(currentUser.birthDate).format("MMMM Do YYYY")
                      ) : (
                        <span style={{ color: "gray", fontSize: "smaller" }}>
                          Veuillez ajouter votre date de naissance
                        </span>
                      )}
                    </p>{" "}
                    <hr />
                    <p>
                      <strong>Address:</strong>{" "}
                      {currentUser.adress ? (
                        currentUser.adress
                      ) : (
                        <span style={{ color: "gray", fontSize: "smaller" }}>
                          Veuillez ajouter votre adresse
                        </span>
                      )}
                    </p>{" "}
                    <hr />
                    <p>
                      <strong>Téléphone:</strong>{" "}
                      {currentUser.phone ? (
                        currentUser.phone
                      ) : (
                        <span style={{ color: "gray", fontSize: "smaller" }}>
                          Veuillez ajouter votre Téléphone
                        </span>
                      )}
                    </p>
                  </Card.Body>
                </Card>
              </div>
              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <hr />
                  <Form.Group controlId="formFirstName">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBirthDate">
                    <Form.Label>Date de naissance</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Mot de passe</Form.Label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                  </Form.Group>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="custom-background custom-placeholder"
                        style={{ color: "gray" }}
                      />
                      <Button
                        variant="light"
                        className="password-toggle"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
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
                        ? "Les mots de passe ne correspondent pas."
                        : "Veuillez confirmer votre mot de passe."}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Addresse</Form.Label>
                    <Form.Control
                      type="text"
                      name="adress"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
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
                    Enregistrer les modifications
                  </Button>
                </Form>
              ) : (
                <Button
                  style={{
                    backgroundColor: "#6A62FA",
                    borderColor: "#6A62FA",
                    borderRadius: "30px",
                    width: "100%",
                  }}
                  variant="secondary"
                  onClick={() => setEditMode(true)}
                >
                  Modifier le profil
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </Card>
    </Container>
  );
};

export default ProfileStudent_Teacher;
