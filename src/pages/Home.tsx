// Importing dependencies
import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { get_user, sign_out } from "@/lib/authUtils";

// Importing UI components
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Importing database
import { supabase } from "@/lib/supabaseClient";

const Home = () => {
  // Navigate state
  const navigate: NavigateFunction = useNavigate();

  // State for the pinned events
  const [pinnedEvents, setPinnedEvents] = useState<string[]>([]);

  // Helper function to fetch all the pinned events
  async function get_pinned_events() {
    let { data: events, error } = await supabase
      .from("users")
      .select("pinned_events")
      .eq("user_id", localStorage.getItem("PlayletUserID"));

    if (error) {
      console.log(error);
      return;
    }

    // Save the events ids
    let pinned_events: string[] = [];
    if (events) {
      events.map((id) => {
        pinned_events.push(id.pinned_events);
      });
    }

    // Save to the state
    setPinnedEvents(pinned_events);
  }

  useEffect(() => {
    // Dismiss all toasts
    toast.dismiss();

    document.title = "Playet Tools | Home";

    get_user();

    // Get the pinned events
    get_pinned_events();
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

      {/* Pinned Events */}
      <div>
        {pinnedEvents.map((event_id, index) => (
          <div key={index}>{event_id}</div>
        ))}
      </div>
    </div>
  );
};

export default Home;
