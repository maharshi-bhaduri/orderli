import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVerification } from "../utils/VerificationContext";

export default function RequireVerification({ children }) {
  const { isVerified } = useVerification();
  const { partnerHandle } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isVerified) {
      navigate(`/${partnerHandle}/verify`);
    }
  }, [isVerified, navigate, partnerHandle]);
  if (!isVerified) return null;
  return children;
}
