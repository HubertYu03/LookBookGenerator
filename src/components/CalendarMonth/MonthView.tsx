// Import Custom Components
import { useState } from "react";
import MonthPreview from "./MonthPreview";

// Import Global Types
import type { Event, User } from "@/types/global";
import EventCard from "../Calendar/EventCard";

type MonthViewProps = {
  monthDates: Date[];
  currentMonth: number;
  events: Event[];
  formatDateLocal: (value: Date) => string;
  user: User;
  getMonthEvents: () => void;
};

const MonthView = ({
  monthDates,
  currentMonth,
  events,
  formatDateLocal,
  user,
  getMonthEvents,
}: MonthViewProps) => {
  // States for event card modal from month view
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [eventPreview, setEventPreview] = useState<Event>();

  return (
    <div className="grid grid-cols-7 gap-2 min-h-[80vh]">
      {monthDates.map((date) => {
        const dayEvents = events
          .filter((event) => event.event_date === formatDateLocal(date))
          .sort((a, b) => {
            // Compare event_start times
            return a.event_start.localeCompare(b.event_start);
          });

        return (
          <MonthPreview
            date={date}
            events={dayEvents}
            key={formatDateLocal(date)}
            currentMonth={currentMonth}
            user={user}
            getMonthEvents={getMonthEvents}
            setOpen={setOpenPreview}
            setEvent={setEventPreview}
          />
        );
      })}

      {/* Event Card */}
      <EventCard
        event={eventPreview}
        open={openPreview}
        setOpen={setOpenPreview}
        user={user}
        getMonthEvents={getMonthEvents}
      />
    </div>
  );
};

export default MonthView;
