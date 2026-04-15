import ContractsBanner from "../components/contracts/ContractsBanner";
import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import "../assets/css/custom.css";

export default function ContractsPage() {
  return(
     <Fragment>
          <NavBar />
          <ContractsBanner />
          <Footer />
        </Fragment>
  );
}