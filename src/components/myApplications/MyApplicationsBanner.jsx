import { Fragment, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function MyApplicationsBanner() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosClient.get(`students/${id}/applications`);
        setApplications(response.data?.data ?? []);
      } catch (error) {
        try {
          const res = await axiosClient.get("applications", {
            params: { student_id: id },
          });
          setApplications(res.data?.data ?? []);
        } catch (err) {
          console.error("Greška pri učitavanju prijava:", error);
        }
      }
    };
    fetchApplications();
  }, [id]);

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Moje prijave</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Moje prijaveee</h2>

        <div className="w-100">
          {applications && applications.length > 0 ? (
            applications.map((app) => (
              <div className="custom-card" key={app.id}>
                <h5 className="title">{app.scholarship_call?.title ?? app.scholarshipCall?.title ?? "Prijava"}</h5>
                <p className="text">Status: {app.status ?? "—"}</p>
                <p className="text">Poslato: {app.created_at ?? app.createdAt ?? "—"}</p>
              </div>
            ))
          ) : (
            <p className="alert-message">Još nema prijava. <a href="/apply">Prijavi se za stipendiju</a></p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}
