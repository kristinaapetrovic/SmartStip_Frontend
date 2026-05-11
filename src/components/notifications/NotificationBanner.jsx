import { useEffect, useState, Fragment } from "react";
import axiosClient from "../../axios/axios-client";
import { Link } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axiosClient.get("/notifications")
      .then(({ data }) => {
        setNotifications(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">

        {/* Breadcrumb (isti kao ostale stranice) */}
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">
            Kontrolna tabla
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Obaveštenja
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Content wrapper (isti layout kao profil) */}
        <div className="d-flex flex-column p-4 pacijentPodaci">

          <h1 className="text-center mb-4 title">
            Obaveštenja
          </h1>

          {notifications.length === 0 ? (
            <p className="text-center">Nema obaveštenja</p>
          ) : (
            notifications.map((n) => (
              <Card key={n.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Link
                    to={`/notifications/${n.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block"
                    }}
                  >
                    <h5 className="mb-1">
                      {n.title ?? "Notification"}
                    </h5>

                    <small style={{ color: n.read_at ? "gray" : "green" }}>
                      {n.read_at ? "Pročitano" : "Novo"}
                    </small>
                  </Link>
                </Card.Body>
              </Card>
            ))
          )}

        </div>
      </Container>
    </Fragment>
  );
}