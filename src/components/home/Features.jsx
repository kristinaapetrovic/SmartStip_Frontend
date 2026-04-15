import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faFileLines, faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import '../../assets/css/custom1.css';

export default function Features() {
  return (
    <Fragment>
      <Container>
        <Row className="justify-content-center">
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard text-center">
              <div className="featureIcon">
                <FontAwesomeIcon icon={faGraduationCap} size="2x" />
              </div>
              <h3 className="title">Prijava za stipendije</h3>
              <p className="text">
                Pregledaj aktuelne konkurse, pošalji prijave i prati status. Otpremi dokumenta i upravljaj svojim profilom na jednom mestu.
              </p>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard text-center">
              <div className="featureIcon">
                <FontAwesomeIcon icon={faFileLines} size="2x" />
              </div>
              <h3 className="title">Pregled komisije</h3>
              <p className="text">
                Komisije ocenjuju prijave pravično i transparentno. Prati tok obrade i dobij obaveštenja kada se donese odluka.
              </p>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard text-center">
              <div className="featureIcon">
                <FontAwesomeIcon icon={faBuildingColumns} size="2x" />
              </div>
              <h3 className="title">Univerziteti i fakulteti</h3>
              <p className="text">
                Stipendije i prilike koje čekaš – otvorene na svim univerzitetima u Srbiji.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}