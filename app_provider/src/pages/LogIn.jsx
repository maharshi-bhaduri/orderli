import { signInWithGoogle, signOutNow } from "../utils/Firebase";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  let navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      signInWithGoogle().then(
        (user) => {
          navigate('/dashboard')
        })
    } catch (error) {
      console.log("Error signing in with Google:", error);
    }
  }

  return (
    <div className="signup">
      <button
        className="signup-btn"
        style={{ backgroundColor: "black", color: "white", padding: "10px" }}
        onClick={handleSignIn}
      >
        Register with gmail
      </button>
    </div>
  );
}
