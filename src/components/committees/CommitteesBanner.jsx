import { Fragment, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import axiosClient from "../../axios/axios-client";
import Breadcrumb from "react-bootstrap/Breadcrumb";

export default function CommitteesBanner() {
  const [committees, setCommittees] = useState([]);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axiosClient.get("committees");
        setCommittees(response.data?.data ?? []);
      } catch (error) {
        console.error("Greška pri učitavanju komisija:", error);
      }
    };
    fetchCommittees();
  }, []);

  return (
    <Fragment>
      <Container fluid className="mainBanner pt-5">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/dashboard">Kontrolna tabla</Breadcrumb.Item>
          <Breadcrumb.Item active>Komisije</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="title mb-4">Komisije</h2>

        <div className="w-100">
          {committees && committees.length > 0 ? (
            committees.map((committee) => (
              <div className="custom-card" key={committee.id}>
                <h5 className="title">{committee.name ?? committee.user?.name ?? "Komisija"}</h5>
                <p className="text">ID: {committee.id}</p>
              </div>
            ))
          ) : (
            <p className="alert-message">Nema komisija za prikaz</p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}
