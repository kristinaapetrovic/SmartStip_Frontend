import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import MyApplicationsBanner from "../components/myApplications/MyApplicationsBanner";

export default function MyApplicationsPage() {
  return (
    <Fragment>
      <NavBar />
      <MyApplicationsBanner />
      <Footer />
    </Fragment>
  );
}
