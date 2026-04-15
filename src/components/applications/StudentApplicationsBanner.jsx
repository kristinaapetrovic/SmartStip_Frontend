import { Fragment, useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function StudentApplicationsBanner() {
  const { id } = useParams(); // id studenta
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const statuses = ["pending", "approved", "on assessment", "rejected", "documents valid"];

  // Fetch student sa prijavama
  useEffect(() => {
    const fetchStudentApplications = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await axiosClient.get(`students/${id}?include=user,applications.scholarship`);
        const studentData = res.data?.data ?? null;
        setStudent(studentData);
        setApplications(studentData?.applications ?? []);
      } catch (err) {
        console.error("Greška pri učitavanju prijava:", err);
        setStudent(null);
        setApplications([]);
        setErrorMessage(
          err?.response?.data?.message ?? "Neuspešno učitavanje prijava. Proverite dozvole."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudentApplications();
  }, [id]);

  // Filtriranje po search i statusu
  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.trim().toLowerCase();
    const scholarshipTitle = (app.scholarship?.title ?? "").toLowerCase();
    const matchesSearch = q === "" || scholarshipTitle.includes(q);
    const matchesStatus = statusFilter === "" || app.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Prijave studenta</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Prijave studenta</h2>

        {/* Banner-style pretraga + filter po statusu */}
        <div className="banner-search mb-4 p-3 rounded" style={{ backgroundColor: "#ccf9d3" }}>
          <Form>
            <Row className="align-items-center">
              <Col md={6} className="mb-2">
                <Form.Group controlId="searchApplications" className="d-flex align-items-center">
                  <Form.Label className="me-3 mb-0 fw-bold">Pretraga prijava</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Po nazivu konkursa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: "0.5rem" }}
                  />
                </Form.Group>
              </Col>

              <Col md={3} className="mb-2">
                <Form.Group controlId="statusFilter" className="d-flex align-items-center">
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
          ) : student && filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                className="custom-card mb-3 p-3"
                key={app.id}
                style={{ cursor: "pointer", transition: "0.2s", border: "1px solid #ddd" }}
                onClick={() => navigate(`/applications/${app.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                <h5 className="title">Prijava #{app.id}</h5>
                <p className="text">Student: {student.user?.name ?? "—"}</p>
                <p className="text">Broj indeksa: {student.index_number ?? "—"}</p>
                <p className="text">Konkurs: {app.scholarship?.title ?? "—"}</p>
                <p className="text">Status: {app.status ?? "—"}</p>
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