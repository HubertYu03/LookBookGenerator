// This is the whole column per date

// Importing global types
import type { User, Event } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing Custom UI components
import EventColumnPreview from "./EventColumnPreview";
import EventCreationModal from "./EventCreationModal";
import EventCard from "./EventCard";

// Importing Icons
import { Plus } from "lucide-react";

type EventColumnProps = {
  date: Date;
  dates: Date[];
  getWeek: () => void;
  user: User | undefined;
};

const EventColumn = ({ date, dates, getWeek, user }: EventColumnProps) => {
  // The events of the column
  const [events, setEvents] = useState<Event[]>();

  // State for event creation button
  const [creationHover, setCreationHover] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // States for event card viewing
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewEvent, setPreviewEvent] = useState<Event>();
  const [previewAuthor, setPreviewAuthor] = useState<User>();

  async function get_events() {
    // Fix: format the date as YYYY-MM-DD without timezone shifting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`; // Always local

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
        <EventColumnPreview
          event={event}
          key={index}
          setPreviewOpen={setPreviewOpen}
          setPreviewEvent={setPreviewEvent}
          setPreviewAuthor={setPreviewAuthor}
        />
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

      {/* Event Creation Modal */}
      <EventCreationModal
        open={modalOpen}
        setOpen={setModalOpen}
        getWeek={getWeek}
        presetDate={date}
      />

      {/* Event Card Preview */}
      <EventCard
        open={previewOpen}
        setOpen={setPreviewOpen}
        event={previewEvent}
        author={previewAuthor}
        user={user}
      />
    </div>
  );
};

export default EventColumn;
