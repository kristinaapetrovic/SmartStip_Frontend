import { Fragment, useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function AdministratorsBanner() {
  const [administrators, setAdministrators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAdministrators = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axiosClient.get(
          "administrators?include=user,faculty,faculty.university"
        );

        setAdministrators(response.data?.data ?? []);
      } catch (error) {
        console.error("Greška pri učitavanju administratora:", error);
        setAdministrators([]);
        setErrorMessage(
          error?.response?.data?.message ??
            "Neuspešno učitavanje administratora."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdministrators();
  }, []);

  const filteredAdministrators = administrators.filter((admin) => {
    const q = searchQuery.trim().toLowerCase();

    const name = (admin.user?.name ?? "").toLowerCase();
    return q === "" || name.includes(q);
  });

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Administratori</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title w-full text-start text-white">Administratori</h2>
        <div className="border-b border-white w-full mb-4" />

        {/* Pretraga */}
        <div
          className="banner-search mb-4 p-3 rounded w-full"
          style={{ backgroundColor: "#ccf9d3" }}
        >
          <Form>
            <Row className="align-items-center">
              <Col md={6}>
                <Form.Group
                  controlId="searchAdmins"
                  className="d-flex align-items-center"
                >
                  <Form.Label className="me-3 mb-0 fw-bold sm:whitespace-nowrap">
                    Pretraga administratora
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Po imenu ili prezimenu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: "0.5rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Lista administratora */}
        <div className="w-100">
          {loading ? (
            <p className="alert-message">Učitavanje administratora...</p>
          ) : errorMessage ? (
            <p className="alert-message">{errorMessage}</p>
          ) : filteredAdministrators.length > 0 ? (
            filteredAdministrators.map((admin) => (
              <div
                className="custom-card mb-3 p-3"
                key={admin.id}
                style={{
                  border: "1px solid #ddd",
                }}
              >
                <h5 className="title">
                  {admin.user?.name}
                </h5>

                <p className="text">
                  Fakultet: {admin.faculty?.name ?? "—"}
                </p>

                <p className="text">
                  Univerzitet: {admin.faculty?.university?.name ?? "—"}
                </p>

                <p className="text">
                  Email: {admin.user?.email ?? "—"}
                </p>
              </div>
            ))
          ) : (
            <p className="alert-message">Nema administratora za prikaz</p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}