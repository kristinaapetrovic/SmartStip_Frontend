import { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios/axios-client";

export default function AdminDashboard() {
  const { user } = useStateContext();
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [studentsRes, appsRes, callsRes] = await Promise.all([
          axiosClient.get(
            "students?include=faculty.university,applications,applications.scholarshipCall"
          ),
          axiosClient.get("applications?include=student,scholarshipCall"),
          axiosClient.get("scholarship-calls"),
        ]);

        setStudents(studentsRes.data?.data ?? studentsRes.data ?? []);
        setApplications(appsRes.data?.data ?? appsRes.data ?? []);
        setCalls(callsRes.data?.data ?? callsRes.data ?? []);
      } catch (err) {
        console.error("Error loading admin dashboard data:", err);
        setError("Neuspešno učitavanje admin podataka. Pokušajte ponovo.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "administrator") {
      fetchAll();
    }
  }, [user]);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
            }
          : app
      )
    );
  };

  const handleSaveApplication = async (app) => {
    if (!app?.id) return;
    setSavingId(app.id);
    try {
      await axiosClient.put(`applications/${app.id}`, {
        status: app.status,
      });
    } catch (err) {
      console.error("Error updating application:", err);
      setError("Neuspešna izmena prijave. Pokušajte ponovo.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <div className="title nameContainer">
          <p>Dobrodošli, {user?.name ?? "Administrator"}</p>
          <p>Uloga: {user?.role ?? "administrator"}</p>
        </div>

        {loading && <p className="alert-message">Učitavanje admin podataka...</p>}
        {error && <p className="alert-message">{error}</p>}

        {!loading && !error && (
          <Row className="w-100 px-3 pb-5">
            <Col lg={6} md={12} className="mb-4">
              <h2 className="title mb-3">Studenti i prijave</h2>
              <div className="w-100" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <div className="custom-card" key={student.id}>
                      <h5 className="title">
                        {student.name ?? student.user?.name ?? "—"}
                      </h5>
                      <p className="text">
                        Broj indeksa: {student.index_number ?? student.indexNumber ?? "—"}
                      </p>
                      <p className="text">Prijave:</p>
                      {student.applications && student.applications.length > 0 ? (
                        <ul className="text" style={{ textAlign: "left" }}>
                          {student.applications.map((app) => (
                            <li key={app.id}>
                              {app.scholarshipCall?.title ??
                                app.scholarship_call?.title ??
                                "Konkurs"}
                              {" — "}
                              {app.status ?? "—"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text">Nema prijava.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="alert-message">Nema studenata za prikaz</p>
                )}
              </div>
            </Col>

            <Col lg={6} md={12} className="mb-4">
              <h2 className="title mb-3">Konkursi</h2>
              <div className="w-100" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {calls && calls.length > 0 ? (
                  calls.map((call) => (
                    <div className="custom-card" key={call.id}>
                      <h5 className="title">
                        {call.title ?? call.name ?? "—"}
                      </h5>
                      <p className="text">{call.description ?? "—"}</p>
                      <p className="text">
                        Rok: {call.deadline ?? "—"}
                      </p>
                      <p className="text">
                        Iznos: {call.amount ?? "—"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="alert-message">Nema konkursa za prikaz</p>
                )}
              </div>
            </Col>

            <Col lg={12} className="mt-4">
              <h2 className="title mb-3">Sve prijave (izmena)</h2>
              <div className="w-100" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {applications && applications.length > 0 ? (
                  applications.map((app) => (
                    <div className="custom-card" key={app.id}>
                      <h5 className="title">Prijava #{app.id}</h5>
                      <p className="text">
                        Student:{" "}
                        {app.student?.name ??
                          app.student?.user?.name ??
                          "—"}
                      </p>
                      <p className="text">
                        Konkurs:{" "}
                        {app.scholarshipCall?.title ??
                          app.scholarship_call?.title ??
                          "—"}
                      </p>
                      <Form.Group className="d-flex align-items-center gap-3 mt-2">
                        <Form.Label className="title m-0">Status</Form.Label>
                        <Form.Select
                          className="formSelect"
                          value={app.status ?? ""}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value)
                          }
                        >
                          <option value="">Izaberite status</option>
                          <option value="pending">Na čekanju</option>
                          <option value="approved">Odobrena</option>
                          <option value="rejected">Odbijena</option>
                        </Form.Select>
                        <Button
                          variant="success"
                          disabled={savingId === app.id}
                          onClick={() => handleSaveApplication(app)}
                        >
                          {savingId === app.id ? "Čuvanje..." : "Sačuvaj"}
                        </Button>
                      </Form.Group>
                    </div>
                  ))
                ) : (
                  <p className="alert-message">Nema prijava za prikaz</p>
                )}
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </Fragment>
  );
}

