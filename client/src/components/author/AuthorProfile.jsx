import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";

function AuthorProfile() {
  const { currentUser } = useContext(userAuthorContextObj);
  return (
    <div className="author-profile">
        <div className="mt-5">
          <Outlet />
        </div>
    </div>
  );
}

export default AuthorProfile;
