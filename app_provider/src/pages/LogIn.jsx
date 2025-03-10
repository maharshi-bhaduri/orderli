import { signInWithGoogle, signOutNow } from "../utils/Firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import googleLogo from "../icons/google.png";

export default function LogIn() {
  let navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      signInWithGoogle().then((user) => {
        navigate("/account");
      });
    } catch (error) {
      console.log("Error signing in with Google:", error);
    }
  };

  return (
    <div className="signup">
      <Button
        size="lg"
        variant="outlined"
        color="blue-gray"
        className="flex items-center gap-3 p-4 rounded-full bg-gray-100 hover:bg-gray-200"
        onClick={handleSignIn}
      >
        <img src={googleLogo} alt="metamask" className="h-6 w-6" />
        Continue with Google
      </Button>
    </div>
  );
}
