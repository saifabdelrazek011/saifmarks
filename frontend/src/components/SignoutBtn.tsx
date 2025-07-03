import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../services/auth";
import { useDashboardContext } from "../context";

const SignoutBtn = ({ onAfterSignout }: { onAfterSignout?: () => void }) => {
  const [signoutLoading, setSignoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleUpdateUserData } = useDashboardContext();
  const navigate = useNavigate();

  const handleSignout = async () => {
    setSignoutLoading(true);
    setError(null);
    try {
      await signout();
      if (onAfterSignout) onAfterSignout();
      await handleUpdateUserData();
      navigate("/signin");
    } catch (err) {
      setError("Signout failed. Please try again.");
    } finally {
      setSignoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow hover:scale-105 transition disabled:opacity-60"
        onClick={handleSignout}
        disabled={signoutLoading}
      >
        {signoutLoading ? "Signing out..." : "Logout"}
      </button>
      {error && (
        <span className="text-red-500 text-sm text-center">{error}</span>
      )}
    </div>
  );
};

export default SignoutBtn;
