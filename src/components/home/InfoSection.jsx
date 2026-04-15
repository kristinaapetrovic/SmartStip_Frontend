import { Fragment } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import studentsImg from '../../assets/images/students.jpg';

export default function InfoSection() {
  return (
    <Fragment>
      <Container className="py-5">
        <Row className="align-items-center">
          {/* LEVA KOLONA: slika */}
          <Col lg={6} md={12} className="mb-4 mb-lg-0">
            <Image
              src={studentsImg}
              alt="Stipendije ilustracija"
              fluid
              rounded
            />
          </Col>

          {/* DESNA KOLONA: tekst */}
          <Col lg={6} md={12}>
            <h2 className="title pb-3">Portal stipendija</h2>
            <p className="text">
              Ova platforma povezuje studente sa prilikama za stipendije. Pregledaj aktuelne konkurse, pošalji prijave i prati tok finansiranja. Univerziteti i komisije upravljaju procesom kako bi odluke bile pravične i transparentne.
            </p>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}