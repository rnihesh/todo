import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import todo from "../../assets/todo.png";
import { getBaseUrl } from "../../utils/config.js";
function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const location = useLocation();

  //function to signout
  async function handleSignout() {
    await signOut();
    localStorage.removeItem("currentuser");
    setCurrentUser(null);
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="header-container mb-3">
      <nav className="navbar d-flex justify-content-between align-items-center p-2 ">
        <div className="logo-container d-flex justify-content-center align-items-center">
          <Link to="/">
            <img src={todo} alt="logo" className="logo" />
          </Link>
        </div>
        <ul className="nav-links d-flex justify-content-around align-items-center m-1 list-unstyled flex-wrap">
          {!isSignedIn ? (
            <>
              <li>
                <Link
                  to="/"
                  className={`nav-item nvi ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="signin"
                  className={`nav-item nvi ${
                    location.pathname === "/signin" ? "active" : ""
                  }`}
                >
                  Signin
                </Link>
              </li>
              <li>
                <Link
                  to="signup"
                  className={`nav-item nvi ${
                    location.pathname === "/signup" ? "active" : ""
                  }`}
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <div className="user-info d-flex align-items-center">
              <img
                src={user.imageUrl}
                alt=""
                width="45px"
                className="user-avatar rounded-circle border"
              />
              <div className="user-details">
                <p className="user-name mb-0 fw-bold">{user.firstName}</p>
              </div>
              <button
                className="btn-signout btn btn-outline-danger "
                onClick={handleSignout}
              >
                Signout
              </button>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
