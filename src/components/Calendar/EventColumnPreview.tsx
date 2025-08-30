// This preview shows each even on each Day column

// Importing global types
import type { Event } from "@/types/global";

type EventColumnPreviewProps = {
  event: Event;
};

const EventColumnPreview = ({ event }: EventColumnPreviewProps) => {
  return (
    <div
      className="p-2 rounded-sm hover:cursor-pointer hover:shadow-md"
      style={{ backgroundColor: event.event_color }}
    >
      <div className="text-sm font-bold">{event.event_title}</div>
      <div className="text-sm">
        {event.event_start} - {event.event_end}
      </div>
    </div>
  );
};

export default EventColumnPreview;
