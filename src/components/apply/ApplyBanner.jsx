import { Fragment, useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function ApplyBanner() {
  const { user } = useStateContext();
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [averageGradeUrl, setAverageGradeUrl] = useState("");
  const [espbUrl, setEspbUrl] = useState("");
  const [identificationCardUrl, setIdentificationCardUrl] = useState("");
  const [proofOfUnenrollmentUrl, setProofOfUnenrollmentUrl] = useState("");

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axiosClient.get("scholarship-calls");
        setCalls(response.data?.data ?? []);
      } catch (error) {
        console.error("Greška pri učitavanju konkursa:", error);
      }
    };
    fetchCalls();
  }, []);

  const handleSubmit = async () => {
  if (
    !selectedCall ||
    !averageGradeUrl ||
    !espbUrl ||
    !identificationCardUrl ||
    !proofOfUnenrollmentUrl
  )
    return;

  try {
    await axiosClient.post("applications", {
      scholarship_call_id: selectedCall.id,
      student_id: user?.id,
      average_grade_url: averageGradeUrl,
      espb_url: espbUrl,
      identification_card_url: identificationCardUrl,
      proof_of_unenrollment_url: proofOfUnenrollmentUrl,
    });

    setSubmitted(true);
    setSelectedCall(null);
    setAverageGradeUrl("");
    setEspbUrl("");
    setIdentificationCardUrl("");
    setProofOfUnenrollmentUrl("");
  }catch (error) {
  console.error("Greška pri slanju prijave:", error);

  const message =
    error?.response?.data?.message || 
    error?.message ||                 
    "Došlo je do greške prilikom slanja prijave.";

  alert(message); 
}

  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Prijava</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Prijava za stipendiju</h2>

        {submitted && (
          <p className="alert-message text-success">Prijava je uspešno poslata!</p>
        )}

        {!selectedCall ? (
          <div className="w-100">
            {calls && calls.length > 0 ? (
              calls.map((call) => (
                <div
                  className="custom-card"
                  key={call.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedCall(call)}
                >
                  <h5 className="title">{call.title ?? call.name ?? "—"}</h5>
                  <p className="text">{call.description ?? "—"}</p>
                  <p className="text">Rok: {call.deadline ?? "—"}</p>
                </div>
              ))
            ) : (
              <p className="alert-message">Trenutno nema otvorenih konkursa.</p>
            )}
          </div>
        ) : (
          <div className="kreirajKartonForma">
            <h5 className="title">{selectedCall.title ?? selectedCall.name}</h5>
            <p className="text">{selectedCall.description}</p>
           
            <label className="title">Dokument o proseku (URL)</label>
<input
  className="formInput mb-2"
  type="text"
  placeholder="Link ka dokumentu"
  value={averageGradeUrl}
  onChange={(e) => setAverageGradeUrl(e.target.value)}
/>

<label className="title">ESPB potvrda (URL)</label>
<input
  className="formInput mb-2"
  type="text"
  placeholder="Link ka dokumentu"
  value={espbUrl}
  onChange={(e) => setEspbUrl(e.target.value)}
/>

<label className="title">Lična karta (URL)</label>
<input
  className="formInput mb-2"
  type="text"
  placeholder="Link ka dokumentu"
  value={identificationCardUrl}
  onChange={(e) => setIdentificationCardUrl(e.target.value)}
/>

<label className="title">Potvrda o nezaposlenosti (URL)</label>
<input
  className="formInput mb-2"
  type="text"
  placeholder="Link ka dokumentu"
  value={proofOfUnenrollmentUrl}
  onChange={(e) => setProofOfUnenrollmentUrl(e.target.value)}
/>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleSubmit}>
                Pošalji prijavu
              </Button>
              <Button variant="secondary" onClick={() => setSelectedCall(null)}>
                Nazad
              </Button>
            </div>
          </div>
        )}
      </Container>
    </Fragment>
  );
}
