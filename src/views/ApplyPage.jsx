import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import ApplyBanner from "../components/apply/ApplyBanner";

export default function ApplyPage() {
  return (
    <Fragment>
      <NavBar />
      <ApplyBanner />
      <Footer />
    </Fragment>
  );
}
