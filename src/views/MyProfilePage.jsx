import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import MyProfileBanner from "../components/myProfile/MyProfileBanner";

export default function MyProfilePage() {
  return (
    <Fragment>
      <NavBar />
      <MyProfileBanner />
      <Footer />
    </Fragment>
  );
}
