import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { FaBell } from "react-icons/fa";
import axiosClient from "../../axios/axios-client";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [navBarBackground, setNavBarBackground] = useState("navBackground");
  const [navBarItem, setNavBarItem] = useState("navItem");
  const [navBarTitle, setNavBarTitle] = useState("navTitle");
  const { token, user, setUser, setToken } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const onScroll = () => {
    if (window.scrollY > 50) {
      setNavBarBackground("navBackgroundScroll");
      setNavBarItem("navItemScroll");
      setNavBarTitle("navTitleScroll");
    } else {
      setNavBarBackground("navBackground");
      setNavBarItem("navItem");
      setNavBarTitle("navTitle");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!token) return;

    axiosClient.get("/notifications")
      .then(({ data }) => {
        setNotifications(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" className={navBarBackground}>
      <Container className={navBarItem}>
        <Navbar.Brand
          href={token != null ? "/dashboard" : "/home"}
          className={navBarTitle}
        >
          SMARTstip
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto gap-3">
            {!token ? (
              <>
                <NavLink to="/universities" className={navBarItem}>
                  Univerziteti
                </NavLink>
                <NavLink to="/login" className={navBarItem}>
                  Prijava
                </NavLink>
                <NavLink to="/register" className={navBarItem}>
                  Registracija
                </NavLink>
              </>
            ) : (
              <>
                {user?.role === "student" && (
                  <>
                    <NavLink to={`/students/${user.role_id}`} className={navBarItem}>
                      Moj profil
                    </NavLink>
                    <NavLink to={`/students/${user.role_id}/applications`} className={navBarItem}>
                      Moje prijave
                    </NavLink>
                    <NavLink to="/scholarships" className={navBarItem}>
                      Konkursi
                    </NavLink>
                  </>
                )}
                {user?.role === "commissioner" && (
                  <>
                    <NavLink to="/applications" className={navBarItem}>
                      Prijave
                    </NavLink>
                    <NavLink to="/administrators" className={navBarItem}>
                      Administratori
                    </NavLink>
                    <NavLink to="/scholarship-calls" className={navBarItem}>
                      Konkursi
                    </NavLink>
                    <NavLink to="/contracts" className={navBarItem}>
                      Ugovori
                    </NavLink>
                  </>
                )}
                {user?.role === "administrator" && (
                  <>
                    <NavLink to="/students" className={navBarItem}>Studenti</NavLink>
                    <NavLink to="/universities-admin" className={navBarItem}>Univerziteti</NavLink>
                    <NavLink to="/scholarship-calls" className={navBarItem}>Konkursi</NavLink>
                    <NavLink to="/applications" className={navBarItem}>Prijave</NavLink>
                  </>
                )}
                {user?.role === "student" && (
                  <Link to="/notifications" className={navBarItem} style={{ position: "relative" }}>
                    <FaBell size={18} />

                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-10px",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          fontSize: "10px",
                          width: "18px",
                          height: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                <NavLink to="#" onClick={handleLogout} className={navBarItem}>
                  Odjava
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
