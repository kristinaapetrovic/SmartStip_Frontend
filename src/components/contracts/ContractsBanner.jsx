import { useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function ContractsBanner() {
  const [contracts, setContracts] = useState([]);
  const [searchIndex, setSearchIndex] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axiosClient.get(
          "contracts?include=student.user"
        );

        setContracts(response.data?.data ?? []);
      } catch (error) {
        console.error("Greška pri učitavanju ugovora:", error);
        setContracts([]);
        setErrorMessage(
          error?.response?.data?.message ??
            "Neuspešno učitavanje ugovora."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // filtriranje po indeksu studenta
  const filteredContracts = contracts.filter((contract) => {
    const q = searchIndex.trim().toLowerCase();
    const indexNumber = (contract.student?.index_number ?? "").toLowerCase();

    return q === "" || indexNumber.includes(q);
  });

  return (
    <Container fluid className="mainBanner pt-5">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
        <Breadcrumb.Item active>Ugovori</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="title mb-4">Ugovori</h2>

      {/* Pretraga po indeksu */}
      <div
        className="banner-search mb-4 p-3 rounded"
        style={{ backgroundColor: "#ccf9d3" }}
      >
        <Form>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group controlId="searchContracts" className="d-flex align-items-center">
                <Form.Label className="me-3 mb-0 fw-bold">Pretraga po broju indeksa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite broj indeksa studenta..."
                  value={searchIndex}
                  onChange={(e) => setSearchIndex(e.target.value)}
                  style={{ borderRadius: "0.5rem" }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Lista ugovora */}
      <div className="w-100">
        {loading ? (
          <p className="alert-message">Učitavanje ugovora...</p>
        ) : errorMessage ? (
          <p className="alert-message">{errorMessage}</p>
        ) : filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <div
              className="custom-card mb-3 p-3"
              key={contract.id}
              style={{
                cursor: "pointer",
                transition: "0.2s",
                border: "1px solid #ddd",
              }}
              onClick={() => navigate(`/contracts/${contract.id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <h5 className="title">Ugovor #{contract.id}</h5>
              <p className="text">
                Student: {contract.student?.user?.name} 
              </p>
              <p className="text">
                Broj indeksa: {contract.student?.index_number ?? "—"}
              </p>
              <p className="text">Tip: {contract.type ?? "—"}</p>
              <p className="text">Datum: {contract.contract_date ?? "—"}</p>
              <p className="text">Potpisan: {contract.signed ? "Da" : "Ne"}</p>
              <p className="text">Raskinut: {contract.terminated ? "Da" : "Ne"}</p>
            </div>
          ))
        ) : (
          <p className="alert-message">Nema ugovora za prikaz</p>
        )}
      </div>
    </Container>
  );
}