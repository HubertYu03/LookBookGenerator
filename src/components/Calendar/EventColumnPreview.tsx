// This preview shows each even on each Day column

// Importing global types
import type { Event, User } from "@/types/global";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";

type EventColumnPreviewProps = {
  event: Event;
  setPreviewOpen: Dispatch<SetStateAction<boolean>>;
  setPreviewEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
  setPreviewAuthor: React.Dispatch<React.SetStateAction<User | undefined>>;
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

const EventColumnPreview = ({
  event,
  setPreviewOpen,
  setPreviewEvent,
  setPreviewAuthor,
}: EventColumnPreviewProps) => {
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Getting the user of the event
  const [author, setAuthor] = useState<User>();

  // Helper function for title formatting
  function title_length_format(title: string): string {
    if (title.length >= 16) {
      return title.substring(0, 10) + "...";
    } else {
      return title;
    }
  }

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
      onClick={() => {
        setPreviewOpen(true);
        setPreviewEvent(event);
        setPreviewAuthor(author);
      }}
    >
      {loading ? (
        <div className="text-sm">Loading...</div>
      ) : (
        <>
          <div className="text-xs sm:text-sm font-bold">
            {title_length_format(event.event_title)}
          </div>
          {event.event_start == "00:00" && event.event_end == "00:00" ? (
            <div className="text-[0.5rem] sm:text-xs mb-2">All Day</div>
          ) : (
            <div className="text-[0.5rem] sm:text-xs mb-2">
              {military_to_normal(event.event_start)}
              {am_pm(event.event_start)} - {military_to_normal(event.event_end)}
              {am_pm(event.event_end)}
            </div>
          )}
          <div className="text-[0.5rem] sm:text-xs">
            {author?.first_name} {author?.last_name}
          </div>
        </>
      )}
    </div>
  );
};

export default EventColumnPreview;
