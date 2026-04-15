import { Fragment, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

// Statusi konkursa, isto kao u Laravel modelu
const statuses = ["open", "closed"];

export default function ScholarshipCallsCreate() {
  const navigate = useNavigate();
  const [newCall, setNewCall] = useState({
    title: "",
    description: "",
    status: "",
    application_deadline: "",
    complaint_deadline: "",
  });

  const handleAddCall = async () => {
    try {
      const payload = {
        title: newCall.title,
        description: newCall.description,
        status: newCall.status || "pending", // default na pending
        application_deadline: newCall.application_deadline,
        complaint_deadline: newCall.complaint_deadline || null,
      };

      await axiosClient.post("scholarship-calls", payload);
      navigate("/scholarship-calls"); // vrati na listu konkursa
    } catch (error) {
      console.error("Greška pri dodavanju konkursa:", error);
    }
  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item href="/scholarship-calls">Konkursi</Breadcrumb.Item>
          <Breadcrumb.Item active>Kreiraj novi konkurs</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Kreiraj novi konkurs</h2>

        <Form className="kreirajKartonForma">
          <Form.Group className="mb-3">
            <Form.Label>Naziv</Form.Label>
            <Form.Control
              type="text"
              value={newCall.title}
              onChange={(e) => setNewCall({ ...newCall, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newCall.description}
              onChange={(e) => setNewCall({ ...newCall, description: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={newCall.status}
              onChange={(e) => setNewCall({ ...newCall, status: e.target.value })}
            >
              <option value="">Izaberi status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rok za prijavu</Form.Label>
            <Form.Control
              type="date"
              value={newCall.application_deadline}
              onChange={(e) => setNewCall({ ...newCall, application_deadline: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rok za prigovor (opciono)</Form.Label>
            <Form.Control
              type="date"
              value={newCall.complaint_deadline}
              onChange={(e) => setNewCall({ ...newCall, complaint_deadline: e.target.value })}
              min={newCall.application_deadline} // complaint mora biti posle application
            />
          </Form.Group>

          <Button variant="success" onClick={handleAddCall}>
            Dodaj konkurs
          </Button>
        </Form>
      </Container>
    </Fragment>
  );
}