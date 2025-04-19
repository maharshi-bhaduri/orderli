import React, { useContext, createContext, useState, useEffect } from "react";

const VerificationContext = createContext();

export function VerificationProvider({ children }) {
  const [isVerified, setIsVerified] = useState(false);
  const [phonenumber, setPhonenumber] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("otpSession");
    if (session) {
      try {
        const { verified, phone } = JSON.parse(session);
        if (verified) {
          setIsVerified(true);
          setPhonenumber(phone);
        }
      } catch {}
    }
  }, []);

  function markVerified(phone) {
    setIsVerified(true);
    setPhonenumber(phone);
    localStorage.setItem(
      "otpSession",
      JSON.stringify({ verified: true, phone })
    );
  }

  return (
    <VerificationContext.Provider
      value={{ isVerified, phonenumber, markVerified }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  return useContext(VerificationContext);
}
