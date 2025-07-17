// Importing dependencies
import { useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { get_user, sign_out } from "@/lib/authUtils";

// Importing UI components
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Home = () => {
  // Navigate state
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // Dismiss all toasts
    toast.dismiss();

    document.title = "Playet Tools | Home";

    get_user();
  }, []);

  return (
    <div className="p-6">
      <div>Home</div>
      <Button
        onClick={() => {
          sign_out(navigate);
        }}
      >
        Sign Out
      </Button>
      <Button
        onClick={() => {
          navigate("/mylookbooks");
        }}
      >
        View My Lookbooks
      </Button>
    </div>
  );
};

export default Home;
