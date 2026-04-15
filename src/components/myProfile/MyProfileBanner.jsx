import { Fragment, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function MyProfileBanner() {
  const { id } = useParams();
  const [student, setStudent] = useState({});
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const typesOfStudy = [
    { value: "undergraduate", label: "Osnovne studije", maxYear: 4 },
    { value: "graduate", label: "Master studije", maxYear: 2 },
    { value: "postgraduate", label: "Doktorske studije", maxYear: 3 },
  ];
  const [maxYearOfStudy, setMaxYearOfStudy] = useState(0);

  // Fetch student
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axiosClient.get(
          `students/${id}?include=faculty.university,user,location`
        );

        // Postavi university_id, faculty_id i location_id direktno
        setStudent((prev) => ({
        ...res.data?.data,
        faculty_id: res.data?.data.faculty?.id ?? "",
        university_id: res.data?.data.faculty?.university?.id ?? "",
        location_id: res.data?.data.location?.id ?? "",
      }));
      } catch (err) {
        console.error("Greška pri učitavanju studenta:", err);
      }
    };
    fetchStudent();
  }, [id]);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axiosClient.get("universities");
        setUniversities(res.data?.data ?? []);
      } catch (err) {
        console.error("Greška pri učitavanju univerziteta:", err);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch faculties when university changes
  useEffect(() => {
    const uid = student.university_id;
    if (!uid) {
      setFaculties([]);
      return;
    }
    const fetchFaculties = async () => {
      try {
        const res = await axiosClient.get(`universities/${uid}?include=faculties`);
        setFaculties(res.data?.data.faculties ?? []);
      } catch (err) {
        setFaculties([]);
      }
    };
    fetchFaculties();
  }, [student.university_id]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get("locations");
        setLocations(res.data ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  // Update max year based on study type
  useEffect(() => {
    const selectedType = typesOfStudy.find((t) => t.value === student.type_of_study);
    if (selectedType) setMaxYearOfStudy(selectedType.maxYear);
  }, [student.type_of_study]);

  // Handle input changes
  const handleChange = (field, value) => {
    // Pretvori id polja u broj
    if (["university_id", "faculty_id", "location_id"].includes(field)) {
      value = Number(value);
    }
    if (field === "university_id") {
      // Reset faculty when university changes
      setStudent({ ...student, university_id: value, faculty_id: "" });
    } else {
      setStudent({ ...student, [field]: value });
    }
  };

  // Save changes
  const handleSubmit = async () => {
    try {
      const payload = {
        index_number: student.index_number,
        university_id: student.university_id,
        faculty_id: student.faculty_id,
        type_of_study: student.type_of_study,
        year_of_study: student.year_of_study,
        average_grade: student.average_grade,
        field_of_study: student.field_of_study,
        street_address: student.street_address,
        phone_number: student.phone_number,
        location_id: student.location_id,
      };
      await axiosClient.put(`students/${id}`, payload);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Neuspešno čuvanje podataka");
    }
  };

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Moj profil</Breadcrumb.Item>
        </Breadcrumb>

        <div className="d-flex flex-column p-4 pacijentPodaci">
          <h1 className="text-center mb-4 title">Moj profil</h1>
          {student && Object.keys(student).length > 0 ? (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ime i prezime</Form.Label>
                    <Form.Control type="text" value={student.user?.name ?? ""} readOnly />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" value={student.user?.email ?? ""} readOnly />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Broj indeksa</Form.Label>
                    <Form.Control
                      type="text"
                      value={student.index_number ?? ""}
                      onChange={(e) => handleChange("index_number", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Univerzitet</Form.Label>
                    <Form.Control
                      as="select"
                      value={student.university_id ?? ""}
                      onChange={(e) => handleChange("university_id", e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Izaberite univerzitet</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Fakultet</Form.Label>
                    <Form.Control
                      as="select"
                      value={student.faculty_id ?? ""}
                      onChange={(e) => handleChange("faculty_id", e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Izaberite fakultet</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tip studija</Form.Label>
                    <Form.Control
                      as="select"
                      value={student.type_of_study ?? ""}
                      onChange={(e) => handleChange("type_of_study", e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Izaberite tip studija</option>
                      {typesOfStudy.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Godina studija</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={maxYearOfStudy}
                      value={student.year_of_study ?? ""}
                      onChange={(e) => handleChange("year_of_study", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Prosek</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="5"
                      max="10"
                      value={student.average_grade ?? ""}
                      onChange={(e) => handleChange("average_grade", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Smer</Form.Label>
                    <Form.Control
                      type="text"
                      value={student.field_of_study ?? ""}
                      onChange={(e) => handleChange("field_of_study", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Adresa</Form.Label>
                    <Form.Control
                      type="text"
                      value={student.street_address ?? ""}
                      onChange={(e) => handleChange("street_address", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      type="text"
                      value={student.phone_number ?? ""}
                      onChange={(e) => handleChange("phone_number", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Lokacija</Form.Label>
                    <Form.Control
                      as="select"
                      value={student.location_id ?? ""}
                      onChange={(e) => handleChange("location_id", e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Izaberite lokaciju</option>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {error && <p className="text-danger">{error}</p>}

              {isEditing ? (
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="success" onClick={handleSubmit}>Sačuvaj izmene</Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>Odustani</Button>
                </div>
              ) : (
                <div className="d-flex justify-content-center">
                  <Button variant="primary" onClick={() => setIsEditing(true)}>Izmeni podatke</Button>
                </div>
              )}
            </>
          ) : (
            <p>Učitavanje profila...</p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}