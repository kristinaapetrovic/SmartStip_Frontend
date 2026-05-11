import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../components/layouts/DefaultLayout";
import GuestLayout from "../components/layouts/GuestLayout";
import HomePage from "../views/HomePage";
import LoginPage from "../views/LoginPage";
import Dashboard from "../views/Dashboard";
import RegisterPage from "../views/RegisterPage";
import MyProfilePage from "../views/MyProfilePage";
import ApplyPage from "../views/ApplyPage";
import UniversitiesPage from "../views/UniversitiesPage";
import UniversitiesAdminPage from "../views/UniversitiesAdminPage";
import StudentsPage from "../views/StudentsPage";
import CommitteesPage from "../views/CommitteesPage";
import ScholarshipCallsPage from "../views/ScholarshipCallsPage";
import ApplicationsPage from "../views/ApplicationsPage";
import ApplicationDetails from "../views/ApplicationDetails";
import AdministratorsPage from "../views/AdministratorsPage";
import ContractsPage from "../views/ContractsPage";
import ContractDetails from "../views/ContractsDetails";
import ScholarshipCallsPageCreate from "../views/ScholarshipCallsPageCreate";
import ApplicationsPageStudent from "../views/ApplicationsPageStudent";
import Notifications from "../views/Notifications";
import NotificationShow from "../views/NotificationShow";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/students/:id/applications", element: <ApplicationsPageStudent /> },
      { path: "/students/:id", element: <MyProfilePage /> },
      { path: "/applications/:id", element: <ApplicationDetails /> },
      { path: "/scholarships", element: <ApplyPage /> },
      { path: "/students", element: <StudentsPage /> },
      { path: "/committees", element: <CommitteesPage /> },
      { path: "/universities-admin", element: <UniversitiesAdminPage /> },
      { path: "/scholarship-calls", element: <ScholarshipCallsPage /> },
      { path: "/applications", element: <ApplicationsPage /> },
      { path: "/administrators", element: <AdministratorsPage /> },
      { path: "/contracts", element: <ContractsPage /> },
      { path: "/contracts/:id", element: <ContractDetails /> },
      { path: "/scholarship-calls/create", element: <ScholarshipCallsPageCreate /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/notifications/:id", element: <NotificationShow /> }
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/universities", element: <UniversitiesPage /> },
    ],
  },
]);

export default router;
