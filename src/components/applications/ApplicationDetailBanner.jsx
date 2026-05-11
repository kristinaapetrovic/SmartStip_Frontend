import { Fragment, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useStateContext } from "../../context/ContextProvider";

export default function ApplicationDetailBanner() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [status, setStatus] = useState("");
  const [reasonForRejection, setReasonForRejection] = useState("");

  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const { user } = useStateContext();

  const isCommissioner = user?.role === "commissioner";

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axiosClient.get(
          `applications/${id}?include=student.user,scholarship`
        );

        const appData = response.data.data;

        setApplication(appData);
        setStatus(appData.status);
        setReasonForRejection(appData.reason_for_rejection ?? "");
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Neuspešno učitavanje prijave."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // 🔥 1. PREBACIVANJE U "ON ASSESSMENT"
  const moveToAssessment = async () => {
    try {
      await axiosClient.put(`applications/${id}`, {
        status: "on assessment",
      });

      setStatus("on assessment");
      setApplication((prev) => ({
        ...prev,
        status: "on assessment",
      }));

      alert("Prijava prebačena u assessment fazu!");
    } catch (err) {
      alert("Greška pri promeni statusa");
    }
  };

  // 🔥 2. VALIDACIJA (PYTHON)
  const handleValidate = async () => {
    try {
      setValidating(true);

      const res = await axiosClient.post(
  "/apply",
        {
           student_index: application.student?.index_number,
  average_grade: application.student?.average_grade,
  scholarship_name: application.scholarship?.title
});

      const result = res.data;
      setValidationResult(result);

      const newStatus = result.success ? "approved" : "rejected";

      await axiosClient.put(`applications/${id}`, {
        status: newStatus,
        reason_for_rejection: result.message ?? null,
      });

      setStatus(newStatus);
      setReasonForRejection(result.message ?? "");

      alert(
        result.success
          ? "Prijava odobrena!"
          : `Odbijena: ${result.message}`
      );

    } catch (err) {
      alert("Greška pri validaciji");
    } finally {
      setValidating(false);
    }
  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">

        {/* BREADCRUMB */}
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">
            Kontrolna tabla
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Detalji prijave
          </Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Detalji prijave</h2>

        {/* LOADING */}
        {loading ? (
          <p className="alert-message">Učitavanje...</p>
        ) : errorMessage ? (
          <p className="alert-message">{errorMessage}</p>
        ) : !application ? (
          <p className="alert-message">Prijava ne postoji.</p>
        ) : (
          <Row>

            {/* LEFT */}
            <Col md={4}>
              <div className="custom-card p-3 mb-3">
                <h5>Student</h5>

                <p><strong>Ime:</strong> {application.student?.user?.name}</p>
                <p><strong>Indeks:</strong> {application.student?.index_number}</p>
                <p><strong>Prosek:</strong> {application.student?.average_grade}</p>
              </div>
            </Col>

            {/* RIGHT */}
            <Col md={8}>
              <div className="custom-card p-3 mb-3">

                <h5>Prijava</h5>

                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg="primary">{status}</Badge>
                </p>

                {user?.role !== "student" && (
  <div className="mb-3">

    {/* ================= ADMIN ================= */}
    {user?.role === "administrator" &&
      application?.status === "pending" && (
        <Button
          variant="warning"
          onClick={async () => {
            try {
              await axiosClient.put(`applications/${id}`, {
                status: "documents valid",
              });

              setStatus("documents valid");
              setApplication((prev) => ({
                ...prev,
                status: "documents valid",
              }));

              alert("Dokumenti validirani!");
            } catch (err) {
              alert("Greška pri validaciji dokumenata");
            }
          }}
        >
          Validiraj dokumente
        </Button>
      )}

    {/* ================= COMMISSIONER ================= */}
    {user?.role === "commissioner" && (
      <>
        {/* STEP 1: documents valid → on assessment */}
        {application?.status === "documents valid" && (
          <Button
            variant="warning"
            onClick={async () => {
              try {
                await axiosClient.put(`applications/${id}`, {
                  status: "on assessment",
                });

                setStatus("on assessment");
                setApplication((prev) => ({
                  ...prev,
                  status: "on assessment",
                }));

                alert("Prebačeno u assessment fazu!");
              } catch (err) {
                alert("Greška pri promeni statusa");
              }
            }}
          >
            Prebaci u assessment
          </Button>
        )}

        {/* STEP 2: on assessment → Python validation */}
        {application?.status === "on assessment" && (
          <Button
            variant="success"
            onClick={handleValidate}
            disabled={validating}
          >
            {validating ? "Validacija..." : "Validiraj prijavu"}
          </Button>
        )}
      </>
    )}

  </div>
)}


                {/* RESULT */}
                {validationResult && (
                  <div className="mb-3">
                    {validationResult.success ? (
                      <span className="text-success fw-bold">
                        ✔ Prijava odobrena
                      </span>
                    ) : (
                      <span className="text-danger fw-bold">
                        ✖ {validationResult.reason}
                      </span>
                    )}
                  </div>
                )}

                {/* REASON */}
                {status === "rejected" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Razlog odbijanja</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reasonForRejection}
                      disabled
                    />
                  </Form.Group>
                )}

                {/* DOCUMENTS */}
                <h6 className="mt-4">Dokumenti</h6>

<ul>
  {/* 📄 PROSEK DOKUMENT */}
  {application.average_grade_url && (
    <li>
      <a
        href={application.average_grade_url}
        target="_blank"
        rel="noreferrer"
      >
        Dokument o prosečnoj oceni
      </a>
    </li>
  )}

  {/* 📄 ESPB DOKUMENT */}
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

  {/* 📄 LIČNA KARTA */}
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

  {/* 📄 NEZAPOSLENOST */}
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

              <div className="custom-card p-3">
  <h5>Podaci o konkursu</h5>

  <p>
    <strong>Naslov:</strong>{" "}
    {application.scholarship?.title ||
     application.scholarship?.name ||
     "—"}
  </p>

  <p>
    <strong>Opis:</strong>{" "}
    {application.scholarship?.description ?? "—"}
  </p>

  <p>
    <strong>Status konkursa:</strong>{" "}
    {application.scholarship?.status ?? "—"}
  </p>

  <p>
    <strong>Rok prijave:</strong>{" "}
    {application.scholarship?.application_deadline ?? "—"}
  </p>
</div>
            </Col>

          </Row>
        )}
      </Container>
    </Fragment>
  );
}