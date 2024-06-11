import React from "react";
import { Table, Card, ListGroup, Image, OverlayTrigger } from "react-bootstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCalendarAlt } from "react-icons/fa";
import { getOneAccount } from "../../JS/actions/accountactions";
import { CgProfile } from "react-icons/cg";

const SoutenanceAdmin = () => {
  const dispatch = useDispatch();
  const allRapports = useSelector((state) => state.rapportR.reports);
  const account = useSelector((state) => state.accountR.account);
  const rapportsWithDateSoutenance = allRapports.filter(
    (report) =>
      report.rapport_status === "approved" &&
      report.date_soutenance !== null &&
      report.date_soutenance !== undefined
  );

  if (rapportsWithDateSoutenance.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Il n'y a pas encore de présentations.</Card.Text>
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
        Soutenance
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
                  <th>État du rapport</th>
                  <th>Date de Soutenance</th>
                </tr>
              </thead>
              <tbody>
                {rapportsWithDateSoutenance.map((report) => (
                  <tr key={report._id}>
                    <td>{report.application.companyName}</td> 

                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                      onEnter={() => getAccount(report.application.student)}
                    >
                      <td>
                        <CgProfile
                          style={{ color: "#6A62FA", cursor: "pointer" }}
                          size={35}
                        />{" "}
                        {report.application.first_name}{" "}
                        {report.application.last_name}
                      </td>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                      onEnter={() => getAccount(report.application.teacher_id)}
                    >
                      <td>
                        <CgProfile
                          style={{ color: "#6A62FA", cursor: "pointer" }}
                          size={35}
                        />{" "}
                        {report.application.teacher_first_name}{" "}
                        {report.application.teacher_last_name}
                      </td>
                    </OverlayTrigger>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(report.application.startDate).format(
                        "YYYY-MM-DD"
                      )}
                    </td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(report.application.endDate).format("YYYY-MM-DD")}
                    </td>
                    <td style={{ color: "green" }}>{report.rapport_status}</td>
                    <td>
                      <FaRegCalendarAlt />{" "}
                      {moment(report.date_soutenance).format("YYYY-MM-DD")}
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

export default SoutenanceAdmin;
