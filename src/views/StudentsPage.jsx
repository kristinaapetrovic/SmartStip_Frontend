import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import StudentsBanner from "../components/students/StudentsBanner";

export default function StudentsPage() {
  return (
    <Fragment>
      <NavBar />
      <StudentsBanner />
      <Footer />
    </Fragment>
  );
}
