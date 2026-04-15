import { Fragment, useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function StudentsBanner() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axiosClient.get(
        "students?include=faculty.university,user"
      );
      setStudents(response.data?.data ?? []);
    } catch (error) {
      // If backend rejects unknown/unauthorized include=user, fall back gracefully.
      try {
        const fallbackResponse = await axiosClient.get( 
          "students?include=faculty.university"
        );
        setStudents(fallbackResponse.data?.data ?? []);
      } catch (fallbackError) {
        console.error("Error fetching students:", fallbackError);
        setStudents([]);
        setErrorMessage(
          fallbackError?.response?.data?.message ??
            "Neuspešno učitavanje studenata. Proverite dozvole i include parametre."
        );
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents =
    searchQuery.trim().length === 0
      ? students
      : students.filter((s) => {
          const q = searchQuery.trim().toLowerCase();
          const name = (s.name ?? s.user?.name ?? "").toLowerCase();
          const index = (s.index_number ?? "").toString().toLowerCase();
          const faculty = (s.faculty?.name ?? "").toLowerCase();
          const uni = (s.faculty?.university?.name ?? "").toLowerCase();
          return (
            name.includes(q) ||
            index.includes(q) ||
            faculty.includes(q) ||
            uni.includes(q)
          );
        });

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Studenti</Breadcrumb.Item>
        </Breadcrumb>

        <Form.Group className="mb-3 mt-5 forme" controlId="searchStudent">
          <Form.Label>Pretraga studenata</Form.Label>
          <Form.Control
            type="text"
            placeholder="Pretraga po imenu, indeksu, fakultetu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>

        <div className="w-100 d-flex flex-column align-items-center">
          {loading ? (
            <p className="alert-message">Učitavanje studenata...</p>
          ) : errorMessage ? (
            <p className="alert-message">{errorMessage}</p>
          ) : filteredStudents && filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div className="custom-card" key={student.id}>
                <h5 className="title">{student.name ?? student.user?.name ?? "—"}</h5>
                <p className="text">Broj indeksa: {student.index_number ??  "—"}</p>
                <p className="text">Univerzitet: {student.faculty?.university?.name ?? "-"}</p>
                <p className="text">Fakultet: {student.faculty?.name ?? "—"}</p>
              </div>
            ))
          ) : (
            <p className="alert-message">Nema studenata za prikaz</p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}













                