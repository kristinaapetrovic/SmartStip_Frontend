import AdministratorsBanner from "../components/administators/AdministratorsBanner";
import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import "../assets/css/custom.css";

export default function AdministratorsPage() {
  return(
     <Fragment>
          <NavBar />
          <AdministratorsBanner />
          <Footer />
        </Fragment>
  );
}