import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import ApplicationDetailBanner from "../components/applications/ApplicationDetailBanner";

export default function ApplicationDetailsPage() {
  return (
    <Fragment>
      <NavBar />
      <ApplicationDetailBanner />
      <Footer />
    </Fragment>
  );
}