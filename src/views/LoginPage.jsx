import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios/axios-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser, setToken } = useStateContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Molimo popunite sva polja");
      return;
    }

    try {
      const response = await axiosClient.post("/login", { email, password });
      setUser(response.data);
      setToken(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Neuspešna prijava. Proverite email i lozinku.");
      cconsole.error(err);
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="guestBackground">
        <form className="loginForm sm:w-[500px] rounded-md" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Lozinka</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="errorBox">{error}</div>

          <button type="submit" className="formButton">Prijavi se</button>
          <div className="flex flex-col gap-2 pt-2">
            <p className="m-0">Nemaš nalog? <Link to="/register">Registruj se</Link></p>
            <p className="m-0">Nazad na početnu? <Link to="/home">Odustani</Link></p>
          </div>
        </form>
      </Container>
    </Fragment>
  );
}
