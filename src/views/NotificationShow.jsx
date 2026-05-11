import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import NotificationShowBanner from "../components/notifications/NotificationShowBanner";

export default function NotificationsShowPage() {
  return (
    <Fragment>
      <NavBar />
      <NotificationShowBanner />
      <Footer />
    </Fragment>
  );
}
