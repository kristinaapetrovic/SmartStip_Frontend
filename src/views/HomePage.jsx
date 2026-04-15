import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import TopBanner from "../components/home/TopBanner";
import Features from "../components/home/Features";
import Summary from "../components/home/Summary";
import InfoSection from "../components/home/InfoSection";
import "../assets/css/custom.css";

export default function HomePage() {
  return (
    <Fragment>
      <NavBar />
      <TopBanner />
      <InfoSection />
      <Features />
      <Summary />
      <Footer />
    </Fragment>
  );
}
