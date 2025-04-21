import { useNavigate, useParams } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();
  let { partnerHandle } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-300 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Thank you for dining with Snaqr!
        </h2>
        <p className="text-lg mb-4">Your bill will be here shortly.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
          onClick={() => navigate(`/${partnerHandle}`)}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
