import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import ScholarshipCallsCreate from "../components/scholarshipCalls/ScholarshipCallsCreate";

export default function ScholarshipCallsPageCreate() {
  return (
    <Fragment>
      <NavBar />
      <ScholarshipCallsCreate />
      <Footer />
    </Fragment>
  );
}