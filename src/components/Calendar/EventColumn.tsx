// This is the whole column per date

// Importing global types
import type { Event } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";
import EventColumnPreview from "./EventColumnPreview";

type EventColumnProps = {
  date: Date;
  dates: Date[];
};

const EventColumn = ({ date, dates }: EventColumnProps) => {
  const [events, setEvents] = useState<Event[]>();

  async function get_events() {
    const formattedDate = date.toISOString().split("T")[0];

    let { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_date", formattedDate)
      .order("event_start", { ascending: true });

    if (events) {
      setEvents(events);
    } else if (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Fetch all the events in this week
    get_events();
  }, [dates]);

  return (
    <div className="w-full p-0.5">
      {events?.map((event, index) => (
        <div key={index}>
          <EventColumnPreview event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventColumn;
