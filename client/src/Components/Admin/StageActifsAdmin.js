import React from "react";
import { Table, Card, ListGroup, Image, OverlayTrigger } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";
import { getOneAccount } from "../../JS/actions/accountactions";
import { CgProfile } from "react-icons/cg";

const StagesActifsAdmin = () => {
  const dispatch = useDispatch();
  const allApplications = useSelector((state) => state.companyR.applications);
  const allReports = useSelector((state) => state.rapportR.reports);
  const account = useSelector((state) => state.accountR.account);
  const approvedApplications = allApplications.filter((application) => {
    const allReportsHaveDateSoutenance = allReports.some(
      (rapport) =>
        rapport.application._id === application._id && rapport.date_soutenance
    );

    return application.status === "approved" && !allReportsHaveDateSoutenance;
  });

  if (approvedApplications.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Aucun stage actif pour le moment.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  const defaultPic =
    "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg";
  const renderTooltip = (props) => (
    <Card style={{ zIndex: "2" }} {...props} key={account._id}>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "150px" }}
      >
        <Image
          variant="top"
          src={
            account.img === defaultPic
              ? defaultPic
              : `http://localhost:4500/${account.img}`
          }
          style={{
            width: "150px",
            height: "150px",
          }}
          roundedCircle
        />
      </div>
      <Card.Body>
        <Card.Title>{`${account.first_name} ${account.last_name}`}</Card.Title>
        <ListGroup>
          <ListGroup.Item variant="dark">
            <strong>E-mail:</strong> {account.email}
          </ListGroup.Item>
          <ListGroup.Item variant="dark">
            <strong>Addresse:</strong> {account.adress}
          </ListGroup.Item>
          <ListGroup.Item variant="dark">
            <strong>Téléphone:</strong> {account.phone}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
        Créé le: {new Date(account.created_on).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );

  const getAccount = (id) => {
    dispatch(getOneAccount(id));
  };

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
                  <th>Nom de l'entreprise</th>
                  <th>Étudiant</th>
                  <th>Enseignant</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                </tr>
              </thead>
              <tbody>
                {approvedApplications.map((application, index) => (
                  <tr key={index}>
                    <td>{application.companyName}</td>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                      onEnter={() => getAccount(application.student)}
                    >
                      <td>
                        <CgProfile
                          style={{ color: "#6A62FA", cursor: "pointer" }}
                          size={35}
                        />{" "}
                        {application.first_name} {application.last_name}
                      </td>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                      onEnter={() => getAccount(application.teacher_id)}
                    >
                      <td>
                        <CgProfile
                          style={{ color: "#6A62FA", cursor: "pointer" }}
                          size={35}
                        />{" "}
                        {application.teacher_first_name}{" "}
                        {application.teacher_last_name}
                      </td>
                    </OverlayTrigger>
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
  );
};

export default StagesActifsAdmin;
