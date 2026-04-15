import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import ApplicationsBanner from "../components/applications/ApplicationsBanner";

export default function ApplicationsPage() {
  return (
    <Fragment>
      <NavBar />
      <ApplicationsBanner />
      <Footer />
    </Fragment>
  );
}
