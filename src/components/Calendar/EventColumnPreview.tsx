// This preview shows each even on each Day column

// Importing global types
import type { Event } from "@/types/global";
import { type Dispatch, type SetStateAction } from "react";

type EventColumnPreviewProps = {
  event: Event;
  setPreviewOpen: Dispatch<SetStateAction<boolean>>;
  setPreviewEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
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
}: EventColumnPreviewProps) => {
  // Helper function for title formatting
  function title_length_format(title: string): string {
    if (title.length >= 16) {
      return title.substring(0, 10) + "...";
    } else {
      return title;
    }
  }

  return (
    <div
      className="p-2 rounded-sm text-white hover:cursor-pointer hover:opacity-95"
      style={{ backgroundColor: event.event_color }}
      onClick={() => {
        setPreviewOpen(true);
        setPreviewEvent(event);
      }}
    >
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
        {event.author_first_name} {event.author_last_name}
      </div>
    </div>
  );
};

export default EventColumnPreview;
