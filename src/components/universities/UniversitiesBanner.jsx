import { Fragment, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function UniversitiesBanner() {
  const [universities, setUniversities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [locations, setLocations] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get("locations");
        setLocations(res?.data ?? []);
      } catch (err) {
        console.error("Greška pri učitavanju lokacija:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const params = new URLSearchParams();

      // include relacije
      params.append("include", "location");

      if (searchName) params.append("name", searchName);
      if (searchLocation) params.append("location_id", searchLocation);

      const url = `universities?${params.toString()}`;

      const response = await axiosClient.get(url);

      setUniversities(response.data?.data ?? []);
    } catch (error) {
      console.error("Greška pri učitavanju univerziteta:", error);
    }
  };

  fetchData();
}, [searchName, searchLocation]);

  return (
    <Fragment>
      <div className="mainBanner">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/home">Početna</Breadcrumb.Item>
          <Breadcrumb.Item active>Univerziteti</Breadcrumb.Item>
        </Breadcrumb>

        <div className="forme">
          <Form.Group className="filterForma" controlId="searchName">
            <Form.Label className="title">Pretraga po nazivu</Form.Label>
            <Form.Control
              className="formInput"
              type="text"
              placeholder="Unesite naziv"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="searchLocation">
            <Form.Label className="title">Filter po lokaciji</Form.Label>
            <Form.Control
              className="formSelect"
              as="select"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            >
              <option value="">Sve lokacije</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name ?? loc.naziv ?? loc.city ?? "—"}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="ustanoveContainer">
          {universities && universities.length > 0 ? (
            universities.map((uni) => (
              <div className="custom-card" key={uni.id}>
                <h5 className="title">{uni.name ?? uni.naziv ?? "—"}</h5>
                <p className="text">Lokacija: {uni.location?.name ?? uni.location?.city ?? "—"}</p>
              </div>
            ))
          ) : (
            <p className="alert-message">Nema univerziteta za prikaz</p>
          )}
        </div>
      </div>
    </Fragment>
  );
}
