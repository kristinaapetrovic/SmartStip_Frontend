import { Fragment, useState, useEffect } from "react";
import { Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios/axios-client";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Osnovni podaci
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Student-specific
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [universityId, setUniversityId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [typeOfStudy, setTypeOfStudy] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [maxYearOfStudy, setMaxYearOfStudy] = useState(0);
  const [averageGrade, setAverageGrade] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);

  const [error, setError] = useState("");

  // Tipovi studija i max godina
  const typesOfStudy = [
    { value: "undergraduate", label: "Osnovne studije", maxYear: 4 },
    { value: "graduate", label: "Master studije", maxYear: 2 },
    { value: "postgraduate", label: "Doktorske studije", maxYear: 3 },
  ];

  // Fetch univerziteta
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axiosClient.get("universities");
        setUniversities(res.data?.data ?? []);
      } catch (err) {
        console.error("Neuspešno učitavanje univerziteta:", err);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch fakulteta za izabrani univerzitet
  useEffect(() => {
    if (!universityId) {
      setFaculties([]);
      setFacultyId("");
      return;
    }
    const fetchFaculties = async () => {
      try {
        const res = await axiosClient.get(
          `universities/${universityId}?include=faculties`,
        );
        setFaculties(res.data?.data?.faculties ?? []);
      } catch (err) {
        setFaculties([]);
        console.error("Greška pri učitavanju fakulteta:", err);
      }
    };
    fetchFaculties();
  }, [universityId]);

  // Fetch lokacija
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get("locations");
        setLocations(res.data ?? []);
      } catch (err) {
        console.error("Greška pri učitavanju lokacija:", err);
      }
    };
    fetchLocations();
  }, []);

  // Update max godina po tipu studija
  useEffect(() => {
    const selectedType = typesOfStudy.find((t) => t.value === typeOfStudy);
    if (selectedType) {
      setMaxYearOfStudy(selectedType.maxYear);
      if (yearOfStudy > selectedType.maxYear) setYearOfStudy("");
    } else {
      setMaxYearOfStudy(0);
    }
  }, [typeOfStudy]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Osnovna validacija
    if (!name || !email || !password || !passwordConfirm) {
      setError("Molimo popunite sva obavezna polja");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Neispravan format email adrese");
      return;
    }
    if (password !== passwordConfirm || password.length < 8) {
      setError(
        "Lozinka mora imati najmanje 8 karaktera i mora se poklapati sa potvrdom",
      );
      return;
    }

    // Student-specific validacija
    if (
      !universityId ||
      !facultyId ||
      !indexNumber ||
      !typeOfStudy ||
      !yearOfStudy ||
      !averageGrade ||
      !fieldOfStudy ||
      !streetAddress ||
      !phoneNumber ||
      !locationId
    ) {
      setError("Molimo popunite sva studentska polja");
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        passwordConfirm,
        university_id: universityId,
        faculty_id: facultyId,
        index_number: indexNumber,
        type_of_study: typeOfStudy,
        year_of_study: yearOfStudy.toString(),
        average_grade: averageGrade,
        field_of_study: fieldOfStudy,
        street_address: streetAddress,
        phone_number: phoneNumber,
        location_id: locationId,
      };

      await axiosClient.post("/register", payload);
      navigate("/login");
    } catch (err) {
      setError("Neuspešna registracija. Proverite unete podatke.");
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="guestBackground">
        <form
          className="loginForm p-8 rounded-md sm:w-2/3"
          onSubmit={handleSubmit}
        >
          <div className="formGrid">
            <Col className="formColumn" lg={6} md={12} sm={12}>
              <label htmlFor="name">Ime i prezime</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ime i prezime"
              />

              <label htmlFor="email">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <label htmlFor="phoneNumber">Telefon</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <label htmlFor="location">Lokacija</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">Izaberite lokaciju</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name ?? l.city ?? "—"}
                  </option>
                ))}
              </select>
              <label htmlFor="streetAddress">Adresa</label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
              <label htmlFor="password">Lozinka</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lozinka"
              />

              <label htmlFor="passwordConfirm">Potvrda lozinke</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Potvrda lozinke"
              />
            </Col>

            <Col className="formColumn" lg={6} md={12} sm={12}>
              <label htmlFor="university">Univerzitet</label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
              >
                <option value="">Izaberite univerzitet</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name ?? u.naziv ?? "—"}
                  </option>
                ))}
              </select>

              <label htmlFor="faculty">Fakultet</label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
              >
                <option value="">Izaberite fakultet</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name ?? f.naziv ?? "—"}
                  </option>
                ))}
              </select>

              <label htmlFor="indexNumber">Broj indeksa</label>
              <input
                type="text"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                placeholder="Broj indeksa"
              />

              <label htmlFor="typeOfStudy">Tip studija</label>
              <select
                value={typeOfStudy}
                onChange={(e) => setTypeOfStudy(e.target.value)}
              >
                <option value="">Izaberite tip studija</option>
                {typesOfStudy.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <label htmlFor="yearOfStudy">Godina studija</label>
              <input
                type="number"
                min={1}
                max={maxYearOfStudy}
                value={yearOfStudy}
                onChange={(e) =>
                  setYearOfStudy(Math.min(e.target.value, maxYearOfStudy))
                }
              />
              <label htmlFor="averageGrade">Prosek</label>
              <input
                type="number"
                step="0.01"
                min="5"
                max="10"
                value={averageGrade}
                onChange={(e) => setAverageGrade(e.target.value)}
              />

              <label htmlFor="fieldOfStudy">Smer</label>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
              />
            </Col>
          </div>

          <div className="errorBox">{error}</div>

          <button type="submit" className="formButton">
            Registruj se
          </button>

          <div className="flex flex-col gap-2 pt-2">
            <p className="m-0">
              Već imaš nalog? <Link to="/login">Prijavi se</Link>
            </p>
            <p className="m-0">
              Nazad na početnu? <Link to="/home">Odustani</Link>
            </p>
          </div>
        </form>
      </Container>
    </Fragment>
  );
}
