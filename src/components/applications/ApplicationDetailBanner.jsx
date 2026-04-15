import { Fragment, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useStateContext } from "../../context/ContextProvider";


// const statuses = ["pending", "approved", "on assessment", "rejected", "documents valid"];

export default function ApplicationDetailBanner() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useStateContext();
  const [reasonForRejection, setReasonForRejection] = useState("");
  const getAvailableStatuses = () => {
  if (!user) return [];

  if (user.role === "administrator") {
    if (application?.status === "pending") {
      return ["documents valid"];
    }
    return [];
  }

  // COMMISSIONER
  if (user.role === "commissioner") {
    if (application?.status === "documents valid") {
      return ["on assessment"];
    }

    if (application?.status === "on assessment") {
      return ["approved", "rejected"];
    }
  }

  return [];
};
 

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await axiosClient.get(
          `applications/${id}?include=student.user,scholarship`
        );

        // VAŽNO: API vraća { data: {...} }
        const appData = response.data.data;
        setReasonForRejection(appData.reason_for_rejection ?? "");

        setApplication(appData);
        setStatus(appData.status);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ?? "Neuspešno učitavanje prijave."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = async () => {
    try {

      if (user.role === "commissioner" && status === "rejected" && !reasonForRejection) {
        alert("Morate uneti razlog odbijanja.");
        return;
      }

      await axiosClient.put(`applications/${id}`, {
        status,
        reason_for_rejection: reasonForRejection
      });

      alert("Status je uspešno promenjen!");

    } catch (error) {
      alert("Neuspešna promena statusa.");
    }
  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          {user?.role !== "student" && (
            <Breadcrumb.Item href="/applications">Prijave</Breadcrumb.Item>
          )}

          {user?.role === "student" && (
            <Breadcrumb.Item href={`/students/${id}/applications`}>
              Moje prijave
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item active>Detalji prijave</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Detalji prijave</h2>

        {loading ? (
          <p className="alert-message">Učitavanje prijave...</p>
        ) : errorMessage ? (
          <p className="alert-message">{errorMessage}</p>
        ) : !application ? (
          <p className="alert-message">Prijava ne postoji.</p>
        ) : (
          <Row>
            {/* STUDENT */}
            <Col md={4}>
              <div className="custom-card p-3 mb-3">
                <h5>Podaci o studentu</h5>

                <p><strong>Ime i prezime:</strong> {application.student?.user?.name ?? "—"}</p>
                <p><strong>Email:</strong> {application.student?.user?.email ?? "—"}</p>
                <p><strong>Broj indeksa:</strong> {application.student?.index_number ?? "—"}</p>
                <p><strong>Godina studija:</strong> {application.student?.year_of_study ?? "—"}</p>
                <p><strong>Tip studija:</strong> {application.student?.type_of_study ?? "—"}</p>
                <p><strong>Prosek:</strong> {application.student?.average_grade ?? "—"}</p>
                <p><strong>Smer:</strong> {application.student?.field_of_study ?? "—"}</p>
                <p><strong>Adresa:</strong> {application.student?.street_address ?? "—"}</p>
                <p><strong>Telefon:</strong> {application.student?.phone_number ?? "—"}</p>
              </div>
            </Col>

            {/* APPLICATION */}
            <Col md={8}>
              <div className="custom-card p-3 mb-3">
                <h5>Podaci o prijavi</h5>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-primary">
                    {application.status}
                  </span>
                </p>
              {user?.role !== "student" && (
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mb-3"
                >
                  <option value={application.status}>{application.status}</option>

                  {getAvailableStatuses().map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              )}
              {user?.role !== "student" && getAvailableStatuses().length > 0 && (
                <Button onClick={handleStatusChange}>
                  Promeni status
                </Button>
              )}
              {(status === "rejected" || application.status === "rejected") && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Razlog odbijanja prijave
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={reasonForRejection}
                    onChange={(e) => setReasonForRejection(e.target.value)}
                    disabled={
                      user.role !== "commissioner" || application.status === "rejected"
                    }
                    placeholder="Unesite razlog odbijanja..."
                  />
                </Form.Group>
              )}

                <h6 className="mt-4">Dokumenti</h6>

                <ul>
                  {application.average_grade_url && (
                    <li>
                      <a
                        href={application.average_grade_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Dokument o proseku
                      </a>
                    </li>
                  )}

                  {application.espb_url && (
                    <li>
                      <a
                        href={application.espb_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ESPB potvrda
                      </a>
                    </li>
                  )}

                  {application.identification_card_url && (
                    <li>
                      <a
                        href={application.identification_card_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lična karta
                      </a>
                    </li>
                  )}

                  {application.proof_of_unenrollment_url && (
                    <li>
                      <a
                        href={application.proof_of_unenrollment_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Potvrda o nezaposlenosti
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* SCHOLARSHIP */}
              <div className="custom-card p-3">
                <h5>Podaci o konkursu</h5>

                <p><strong>Naslov:</strong> {application.scholarship?.title ?? "—"}</p>
                <p><strong>Opis:</strong> {application.scholarship?.description ?? "—"}</p>
                <p><strong>Status konkursa:</strong> {application.scholarship?.status ?? "—"}</p>
                <p><strong>Rok prijave:</strong> {application.scholarship?.application_deadline ?? "—"}</p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </Fragment>
  );
}