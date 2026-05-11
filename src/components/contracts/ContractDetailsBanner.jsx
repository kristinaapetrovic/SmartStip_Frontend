import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function ContractDetailBanner() {
  const { id } = useParams();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Editable fields
  const [contractDate, setContractDate] = useState("");
  const [signed, setSigned] = useState(false);
  const [terminated, setTerminated] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axiosClient.get(
          `contracts/${id}?include=student.user,scholarship`
        );

        const data = response.data.data;
        setContract(data);

        // Set editable fields
        setContractDate(data.contract_date ?? "");
        setSigned(Boolean(data.signed));
        setTerminated(Boolean(data.terminated));
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ?? "Neuspešno učitavanje ugovora."
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axiosClient.put(`contracts/${id}`, {
        contract_date: contractDate,
        signed,
        terminated,
      });
      alert("Ugovor je uspešno ažuriran!");
    } catch (error) {
      alert("Neuspešno ažuriranje ugovora.");
      console.error(err);
    }
  };

  return (
    <Container fluid className="mainBanner pt-5">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
        <Breadcrumb.Item href="/contracts">Ugovori</Breadcrumb.Item>
        <Breadcrumb.Item active>Detalji ugovora</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="title  text-start text-white w-full">Detalji ugovora</h2>
        <div className="border-b border-white w-full mb-4" />

      {loading ? (
        <p className="alert-message">Učitavanje ugovora...</p>
      ) : errorMessage ? (
        <p className="alert-message">{errorMessage}</p>
      ) : !contract ? (
        <p className="alert-message">Ugovor ne postoji.</p>
      ) : (
        <Row>
          {/* STUDENT */}
          <Col md={4}>
            <div className="custom-card p-3 mb-3">
              <h5>Podaci o studentu</h5>
              <p>
                <strong>Ime i prezime:</strong>{" "}
                {contract.student?.user?.first_name ?? "—"}{" "}
                {contract.student?.user?.last_name ?? ""}
              </p>
              <p>
                <strong>Email:</strong> {contract.student?.user?.email ?? "—"}
              </p>
              <p>
                <strong>Broj indeksa:</strong> {contract.student?.index_number ?? "—"}
              </p>
              <p>
                <strong>Godina studija:</strong> {contract.student?.year_of_study ?? "—"}
              </p>
              <p>
                <strong>Tip studija:</strong> {contract.student?.type_of_study ?? "—"}
              </p>
            </div>
          </Col>

          {/* CONTRACT */}
          <Col md={8}>
            <div className="custom-card p-3 mb-3">
              <h5>Podaci o ugovoru</h5>
              <Form.Group className="mb-3" controlId="contractDate">
                <Form.Label>Datum ugovora</Form.Label>
                <Form.Control
                  type="date"
                  value={contractDate}
                  onChange={(e) => setContractDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signed">
                <Form.Check
                  type="checkbox"
                  label="Potpisan"
                  checked={signed}
                  onChange={(e) => setSigned(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="terminated">
                <Form.Check
                  type="checkbox"
                  label="Raskinut"
                  checked={terminated}
                  onChange={(e) => setTerminated(e.target.checked)}
                />
              </Form.Group>

              <Button onClick={handleUpdate}>Sačuvaj promene</Button>
            </div>

            {/* SCHOLARSHIP */}
            {contract.scholarship && (
              <div className="custom-card p-3 mb-3">
                <h5>Podaci o konkursu</h5>
                <p>
                  <strong>Naziv:</strong> {contract.scholarship.title}
                </p>
                <p>
                  <strong>Opis:</strong> {contract.scholarship.description}
                </p>
                <p>
                  <strong>Status:</strong> {contract.scholarship.status}
                </p>
                <p>
                  <strong>Rok za prijave:</strong> {contract.scholarship.application_deadline}
                </p>
                <p>
                  <strong>Rok za žalbe:</strong> {contract.scholarship.complaint_deadline}
                </p>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}