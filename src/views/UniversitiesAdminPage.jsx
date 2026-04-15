import { Fragment, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import axiosClient from "../axios/axios-client";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function UniversitiesAdminPage() {
  const [universities, setUniversities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    location_id: "",
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get("locations");
        setLocations(res.data?.data ?? []);
      } catch (err) {
        console.error("Greška pri učitavanju lokacija:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("universities?include=location");
        setUniversities(response.data?.data ?? []);
      } catch (error) {
        console.error("Greška pri učitavanju univerziteta:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddUniversity = async () => {
    try {
      const payload = {
        name: newUniversity.name,
        location_id: newUniversity.location_id || null,
      };
      const response = await axiosClient.post("universities?include=location", payload);
      setUniversities([...universities, response.data?.data ?? response.data]);
      setShowAddForm(false);
      setNewUniversity({ name: "", location_id: "" });
    } catch (error) {
      console.error("Greška pri dodavanju univerziteta:", error);
    }
  };

  return (
    <>
      <NavBar />
      <Fragment>
        <div className="mainBanner">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
            <Breadcrumb.Item active>Univerziteti</Breadcrumb.Item>
          </Breadcrumb>

          

          <div className="ustanoveContainer">
            {universities && universities.length > 0 ? (
              universities.map((uni) => (
                <div className="custom-card" key={uni.id}>
                  <h5 className="title">{uni.name ?? "—"}</h5>
                  <p className="text">Lokacija: {uni.location?.name ?? "—"}</p>
                </div>
              ))
            ) : (
              <p className="alert-message">Nema univerziteta za prikaz</p>
            )}
          </div>
        </div>
      </Fragment>
      <Footer />
    </>
  );
}
