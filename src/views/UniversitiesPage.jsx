import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import UniversitiesBanner from "../components/universities/UniversitiesBanner";

export default function UniversitiesPage() {
  return (
    <Fragment>
      <NavBar />
      <UniversitiesBanner />
      <Footer />
    </Fragment>
  );
}
