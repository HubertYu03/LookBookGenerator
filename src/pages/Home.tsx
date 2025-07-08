// Importing dependencies
import { useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { get_user } from "@/lib/utils";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing UI components
import { Button } from "@/components/ui/button";

const Home = () => {
  // Navigate state
  const navigate: NavigateFunction = useNavigate();

  // Helper function to sign out the user
  async function sign_out() {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      localStorage.removeItem("PlayletUserID");
      navigate("/login");
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    document.title = "Playet Tools | Home";

    get_user(navigate);
  }, []);

  return (
    <div className="p-6">
      <div>Home</div>
      <Button onClick={sign_out}>Sign Out</Button>
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
