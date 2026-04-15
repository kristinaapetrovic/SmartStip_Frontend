import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import MainBanner from "../components/dashboard/MainBanner";

export default function Dashboard() {
  return (
    <Fragment>
      <NavBar />
      <MainBanner />
      <Footer />
    </Fragment>
  );
}


