import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <span className="brand"><span className="logo">✦</span> Campus<b>Hub</b></span>
      <div className="links">
        <NavLink to="/" end>Events</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/organisers">Organisers</NavLink>
      </div>
    </nav>
  );
}
