import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Can from "../rbac/Can";
import { serverEndpoint } from "../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);
  const navigate = useNavigate();
  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/send-reset-token`, {
        email: userDetails.email,
      });

      alert("Reset code sent to your email.");
      navigate("/reset-password", {
        state: {
          email: userDetails.email,
          isLoggedIn: true,
        },
      });
    } catch (err) {
      console.error("Error sending reset code:", err);
      alert(err.response?.data?.message || "Failed to send reset code.");
    }
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          Affiliate++
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* Add other nav links here if needed */}
                    </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userDetails ? userDetails.name : <>Account</>}
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/manage-payment">
                    {" "}
                    Payments
                  </Link>
                </li>
                <Can permission="canViewUser">
                  <li>
                    <Link className="dropdown-item" to="/users">
                      {" "}
                      Manage Users{" "}
                    </Link>
                  </li>
                </Can>

                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </li>

                <hr className="m-0" />
                <li>
                  <Link className="dropdown-item" to="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
