import { Fragment } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Container } from "react-bootstrap";

export default function MainBanner() {
  const { user } = useStateContext();

  return (
    <Fragment>
      <Container fluid={true} className="mainBanner">
        <div className="title nameContainer">
          <p>Dobrodošli, {user?.name ?? "Korisnik"}</p>
          <p>Uloga: {user?.role ?? "—"}</p>
        </div>
      </Container>
    </Fragment>
  );
}
