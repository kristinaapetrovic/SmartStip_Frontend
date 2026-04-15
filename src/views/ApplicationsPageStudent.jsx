import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import StudentApplicationsBanner from "../components/applications/StudentApplicationsBanner";

export default function ApplicationsPageStudent() {
  return (
    <Fragment>
      <NavBar />
      <StudentApplicationsBanner />
      <Footer />
    </Fragment>
  );
}
