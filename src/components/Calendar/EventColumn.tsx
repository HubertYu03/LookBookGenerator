// This is the whole column per date

// Importing global types
import type { Event } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing Custom UI components
import EventColumnPreview from "./EventColumnPreview";
import EventCreationModal from "./EventCreationModal";

// Importing Icons
import { Plus } from "lucide-react";

type EventColumnProps = {
  date: Date;
  dates: Date[];
  getWeek: () => void;
};

const EventColumn = ({ date, dates, getWeek }: EventColumnProps) => {
  // The events of the column
  const [events, setEvents] = useState<Event[]>();

  // State for event creation button
  const [creationHover, setCreationHover] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
        <EventColumnPreview event={event} key={index} />
      ))}
      <div
        className="flex items-center justify-center h-16 hover:cursor-pointer
                 hover:bg-gray-200 transition fade-in-10 rounded-sm"
        onMouseEnter={() => setCreationHover(true)}
        onMouseLeave={() => setCreationHover(false)}
        onClick={() => {
          setModalOpen(true);
          console.log(date);
        }}
      >
        {creationHover && <Plus />}
      </div>

      <EventCreationModal
        open={modalOpen}
        setOpen={setModalOpen}
        getWeek={getWeek}
        presetDate={date}
      />
    </div>
  );
};

export default EventColumn;
