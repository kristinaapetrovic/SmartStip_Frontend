import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import ScholarshipCallsBanner from "../components/scholarshipCalls/ScholarshipCallsBanner";

export default function ScholarshipCallsPage() {
  return (
    <Fragment>
      <NavBar />
      <ScholarshipCallsBanner />
      <Footer />
    </Fragment>
  );
}
