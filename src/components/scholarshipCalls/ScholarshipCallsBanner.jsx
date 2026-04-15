import { Fragment, useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useNavigate } from "react-router-dom"; 
import { useStateContext } from "../../context/ContextProvider";

export default function ScholarshipCallsBanner() {
  const [calls, setCalls] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useStateContext();
  const [newCall, setNewCall] = useState({
    title: "",
    description: "",
    deadline: "",
    amount: "",
  });

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await axiosClient.get("scholarship-calls");
      setCalls(response.data?.data ?? []);
    } catch (error) {
      console.error("Greška pri učitavanju konkursa:", error);
    }
  };

  const handleAddCall = async () => {
    try {
      const payload = {
        title: newCall.title,
        description: newCall.description,
        deadline: newCall.deadline || null,
        amount: newCall.amount ? Number(newCall.amount) : null,
      };
      await axiosClient.post("scholarship-calls", payload);
      fetchCalls();
      setShowAddForm(false);
      setNewCall({ title: "", description: "", deadline: "", amount: "" });
    } catch (error) {
      console.error("Error adding scholarship call:", error);
    }
  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Konkursi</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Konkursi</h2>

        {user?.role === "commissioner" && (
          <Button
            variant="primary"
            className="mb-4"
            onClick={() => navigate("/scholarship-calls/create")}
          >
            Kreiraj novi konkurs
          </Button>
        )}

        {/* POSTOJEĆI FORM ZA DODAVANJE */}
        {showAddForm && (
          <div className="kreirajKartonForma mb-4">
            <input
              type="text"
              placeholder="Naziv"
              value={newCall.title}
              onChange={(e) => setNewCall({ ...newCall, title: e.target.value })}
              className="formInput mb-2"
            />
            <input
              type="text"
              placeholder="Opis"
              value={newCall.description}
              onChange={(e) => setNewCall({ ...newCall, description: e.target.value })}
              className="formInput mb-2"
            />
            <input
              type="date"
              placeholder="Rok"
              value={newCall.deadline}
              onChange={(e) => setNewCall({ ...newCall, deadline: e.target.value })}
              className="formInput mb-2"
            />
            <input
              type="number"
              placeholder="Iznos"
              value={newCall.amount}
              onChange={(e) => setNewCall({ ...newCall, amount: e.target.value })}
              className="formInput mb-2"
            />
            <Button variant="success" onClick={handleAddCall}>
              Dodaj
            </Button>
          </div>
        )}

        <div className="w-100">
          {calls && calls.length > 0 ? (
            calls.map((call) => (
              <div className="custom-card" key={call.id}>
                <h5 className="title">{call.title ?? "—"}</h5>
                <p className="text">{call.description ?? "—"}</p>
                <p className="text">Status: {call.status ?? "—"}</p>
                <p className="text">Rok za prijavu: {call.application_deadline ?? "—"}</p>
                <p className="text">Rok za prigovor: {call.complaint_deadline ?? "—"}</p>
              </div>
            ))
          ) : (
            <p className="alert-message">Nema konkursa za prikaz</p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}