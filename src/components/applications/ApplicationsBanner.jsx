import { Fragment, useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function ApplicationsBanner() {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // filter po statusu
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const statuses = [
    "pending",
    "approved",
    "on assessment",
    "rejected",
    "documents valid",
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await axiosClient.get(
          "applications?include=student.user,scholarship",
        );
        setApplications(response.data?.data ?? []);
      } catch (error) {
        console.error("Greška pri učitavanju prijava:", error);
        setApplications([]);
        setErrorMessage(
          error?.response?.data?.message ??
            "Neuspešno učitavanje prijava. Proverite dozvole.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Filtriranje po search i statusu
  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.trim().toLowerCase();
    const studentIndex = (app.student?.index_number ?? "").toLowerCase();
    const scholarshipTitle = (app.scholarship?.title ?? "").toLowerCase();
    const matchesSearch =
      q === "" || studentIndex.includes(q) || scholarshipTitle.includes(q);

    const matchesStatus =
      statusFilter === "" ||
      app.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Prijave</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title text-start text-white w-full">Prijave</h2>
        <div className="border-b border-white w-full mb-4" />

        {/* Banner-style pretraga + filter po statusu */}
        <div
          className="banner-search mb-4 p-3 rounded w-100"
          style={{ backgroundColor: "#ccf9d3" }}
        >
          <Form className="w-100">
            <Row className="align-items-center">
              <Col md={6} className="mb-2">
                <Form.Group
                  controlId="searchApplications"
                  className="d-flex align-items-center"
                >
                  <Form.Label className="me-3 mb-0 fw-bold sm:whitespace-nowrap">
                    Pretraga prijava
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Po indeksu ili nazivu konkursa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: "0.5rem" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-2">
                <Form.Group
                  controlId="statusFilter"
                  className="d-flex align-items-center"
                >
                  <Form.Label className="me-3 mb-0 fw-bold">Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <option value="">Svi</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Lista prijava */}
        <div className="w-100">
          {loading ? (
            <p className="alert-message">Učitavanje prijava...</p>
          ) : errorMessage ? (
            <p className="alert-message">{errorMessage}</p>
          ) : filteredApplications && filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                className="custom-card mb-3 p-3 text-start flex flex-col justify-between items-center sm:flex-col sm:flex-row"
                key={app.id}
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                  border: "1px solid #ddd",
                }}
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <Col md={1}>
                  <h5 className="title">Prijava #{app.id}</h5>
                </Col>
                <Col md={2}>
                  <p className="text">
                    Student: {app.student?.user?.name ?? "—"}
                  </p>
                </Col>
                <Col md={2}>
                  <p className="text">
                    Broj indeksa: {app.student?.index_number ?? "—"}
                  </p>
                </Col>
                <Col md={2}>
                  <p className="text">Konkurs: {app.scholarship?.title ?? "—"}</p>
                </Col>
                <Col md={2}>
                  <p className="text">Status: {app.status ?? "—"}</p>
                </Col>
              </div>
            ))
          ) : (
            <p className="alert-message">Nema prijava za prikaz</p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}
