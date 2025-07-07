import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate, type NavigateFunction } from "react-router-dom";

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
  }, []);

  return (
    <div>
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
