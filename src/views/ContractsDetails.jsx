import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import ContractDetailsBanner from "../components/contracts/ContractDetailsBanner";

export default function ContractDetailsPage() {
  return (
    <Fragment>
      <NavBar />
      <ContractDetailsBanner />
      <Footer />
    </Fragment>
  );
}