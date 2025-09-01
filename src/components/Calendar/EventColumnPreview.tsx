// This preview shows each even on each Day column

// Importing global types
import type { Event, User } from "@/types/global";
import { useEffect, useState } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";

type EventColumnPreviewProps = {
  event: Event;
};

// Helper functions for time formatting
function am_pm(value: string): string {
  // Split the time
  let time_split: string[] = value.split(":");
  if (Number(time_split[0]) >= 12) {
    return "PM";
  } else {
    return "AM";
  }
}

function military_to_normal(value: string): string {
  // Split the time
  let time_split: string[] = value.split(":");

  // If the first number is greater than 12, subtract 12 from it
  if (Number(time_split[0]) > 12) {
    let formatted_hour: number = Number(time_split[0]) - 12;
    time_split[0] = String(formatted_hour);
  }

  return Number(time_split[0]) + ":" + time_split[1];
}

const EventColumnPreview = ({ event }: EventColumnPreviewProps) => {
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Getting the user of the event
  const [author, setAuthor] = useState<User>();

  // Helper function to get the author of the event
  async function get_author() {
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", event.event_author);

    if (users) {
      setAuthor(users[0]);
      setLoading(false);
    } else {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    get_author();
  }, []);

  return (
    <div
      className="p-2 rounded-sm text-white hover:cursor-pointer hover:opacity-95"
      style={{ backgroundColor: event.event_color }}
    >
      {loading ? (
        <div className="text-sm">Loading...</div>
      ) : (
        <>
          <div className="text-sm font-bold">{event.event_title}</div>
          <div className="text-xs mb-2">
            {military_to_normal(event.event_start)}
            {am_pm(event.event_start)} - {military_to_normal(event.event_end)}
            {am_pm(event.event_end)}
          </div>
          <div className="text-xs">
            {author?.first_name} {author?.last_name}
          </div>
        </>
      )}
    </div>
  );
};

export default EventColumnPreview;
