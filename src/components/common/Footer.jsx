import { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/custom.css";

export default function Footer() {
  return (
    <Fragment>
      <Container fluid={true} className="footerSection pb-5">
        <Row className="pt-5">
          <Col lg={4} md={4} sm={12}>
            <h2 className="footerName text-center pb-3">Zapratite nas</h2>
            <div className="m-2 text-center">
              <a className="p-2 text-light iconTransition" href="#">
                <FontAwesomeIcon className="social" icon={faFacebook} size="2x" />
              </a>
              <a className="p-2 text-light iconTransition" href="#">
                <FontAwesomeIcon className="social" icon={faYoutube} size="2x" />
              </a>
              <a className="p-2 text-light iconTransition" href="#">
                <FontAwesomeIcon className="social" icon={faTwitter} size="2x" />
              </a>
            </div>
          </Col>
          <Col lg={4} md={4} sm={12}>
            <h2 className="footerName text-center">Adresa</h2>
            <p className="text-center">
              <FontAwesomeIcon icon={faMapPin} className="pe-2" />
              Kancelarija za stipendije<br />Univerzitetski kampus
            </p>
          </Col>
          <Col lg={4} md={4} sm={12}>
            <h2 className="footerName text-center">Kontakt</h2>
            <p className="text-center">
              <FontAwesomeIcon icon={faPhone} className="pe-2" />
              +1 234 567 890<br />
              <FontAwesomeIcon icon={faPhone} className="pe-2" />
              scholarships@university.edu
            </p>
          </Col>
        </Row>
      </Container>
      <Container fluid={true} className="copyrightSection">
        <p className="m-0">Autorska prava © 2025 Portal stipendija</p>
      </Container>
    </Fragment>
  );
}
