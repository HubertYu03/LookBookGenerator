// Importing UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Importing Global Types
import type { Event, User } from "@/types/global";

// Importing Custom Components
import MonthEventPreview from "./MonthEventPreview";
import MonthPreviewSmall from "./MonthPreviewSmall";

// Import Icons
import { ChevronDown } from "lucide-react";

// Importing Dependencies
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

type MonthPreviewProps = {
  date: Date;
  events: Event[];
  currentMonth: number;
  user: User;
  getMonthEvents: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
};

const MonthPreview = ({
  date,
  events,
  currentMonth,
  setOpen,
  setEvent,
}: MonthPreviewProps) => {
  // Check to see if the viewport is mobile
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // State for opening day view
  const [dayOpen, setDayOpen] = useState<boolean>(false);

  return (
    <div
      className={`p-2 border rounded h-30 ${
        date.getMonth() != currentMonth && "opacity-30"
      }`}
      onClick={() => {
        if (isMobile && date.getMonth() == currentMonth && events.length > 0)
          setDayOpen(true);
      }}
    >
      <div className="flex flex-col items-center sm:items-start">
        {date.getDate()}
      </div>

      {!isMobile ? (
        <div className="flex flex-col gap-1">
          {/* Preview of events for this day */}
          {events.map((event, index) => (
            <MonthPreviewSmall
              event={event}
              key={event.event_id}
              index={index}
              setOpen={setOpen}
              setEvent={setEvent}
            />
          ))}

          {/* View all events buttons */}
          {events.length >= 3 && (
            <div
              className="flex flex-row items-center justify-center p-1 
            text-xs rounded-sm hover:bg-gray-200 hover:cursor-pointer"
              onClick={() => setDayOpen(true)}
            >
              More <ChevronDown size={16} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-3">
          {events.length > 0 && (
            <>
              <div className="font-bold">{events.length}</div>
              <div
                style={{ backgroundColor: events[0].event_color }}
                className="h-5 w-5 rounded-full"
              />
            </>
          )}
        </div>
      )}

      <Dialog open={dayOpen} onOpenChange={setDayOpen}>
        <DialogContent showCloseButton={!isMobile}>
          {/* Header section */}
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {date.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription className="text-justify">
              A more in depth view of the events for this day. Click or tap on
              an event to view it in more detail.
            </DialogDescription>
          </DialogHeader>

          {/* Events in the day */}
          <div className="flex flex-col gap-2 h-[60vh] overflow-auto p-2">
            {events.map((event) => (
              <MonthEventPreview
                event={event}
                key={event.event_id}
                setOpen={setOpen}
                setEvent={setEvent}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthPreview;
