import React, { createContext, useContext, useEffect, useState } from "react";

// import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);
const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setIsLogged(true)
    // getCurrentUser()
    //   .then(res => {
    //     if (res) {
    //       setIsLogged(true);
    //       setUser(res);
    //     } else {
    //       setIsLogged(false);
    //       setUser(null);
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        phoneNum,
        setPhoneNum,
        role,
        setRole
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
