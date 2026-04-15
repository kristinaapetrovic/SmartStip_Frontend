import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import CommitteesBanner from "../components/committees/CommitteesBanner";

export default function CommitteesPage() {
  return (
    <Fragment>
      <NavBar />
      <CommitteesBanner />
      <Footer />
    </Fragment>
  );
}
