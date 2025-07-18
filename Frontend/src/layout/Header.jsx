import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const UserDetails = useSelector((state) => state.userDetails);

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
         Affiliate++
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {!UserDetails && (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}
            {UserDetails && (
              <Link className="nav-link" to="/logout">
                Logout
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
