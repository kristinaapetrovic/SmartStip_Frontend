import { Fragment, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { init } from "ityped";

export default function TopBanner() {
  useEffect(() => {
    const myElement = document.querySelector("#myElement");
    if (myElement) {
      init(myElement, {
        showCursor: false,
        strings: ["Prijavi se za stipendije", "Prati svoje prijave", "Finansiraj svoje školovanje"],
      });
    }
  }, []);

  return (
    <Fragment>
      <Container fluid className="topFixedBanner">
        <div className="topBannerOverlay">
          <Row className="topBannerContainer">
            <Col lg={6} md={6} sm={12} className="topBannerText">
              <h1 className="title" id="myElement"></h1>
              <p className="text">
                Prijavi se za stipendije, prati svoje prijave i upravljaj finansiranjem — sve na jednom mestu. Univerziteti, komisije i administratori zajedno rade na podršci tvom obrazovanju.
              </p>
            </Col>
            <Col lg={6} md={6} sm={12}></Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
}
