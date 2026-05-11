import { Fragment } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import NotificationBanner from "../components/notifications/NotificationBanner";

export default function NotificationsPage() {
  return (
    <Fragment>
      <NavBar />
      <NotificationBanner />
      <Footer />
    </Fragment>
  );
}
