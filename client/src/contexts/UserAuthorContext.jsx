import { createContext, useEffect, useState } from "react";

export const userAuthorContextObj = createContext();

function UserAuthorContext({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentuser")) || {
      firstName: "",
      lastName: "",
      email: "",
      profileImageUrl: "",
    };
  });

  useEffect(() => {
    if (currentUser && currentUser.email) {
      localStorage.setItem("currentuser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <userAuthorContextObj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </userAuthorContextObj.Provider>
  );
}

export default UserAuthorContext;
