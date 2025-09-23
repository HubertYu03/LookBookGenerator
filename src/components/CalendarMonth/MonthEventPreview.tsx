// Importing Global Type
import type { Event } from "@/types/global";
import { Calendar, Clock } from "lucide-react";

import MonthPreviewComments from "./MonthPreviewComments";

type MonthEventPreviewProps = {
  event: Event;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
};

const MonthEventPreview = ({
  event,
  open,
  setOpen,
  setEvent,
}: MonthEventPreviewProps) => {
  // Variables for time format
  const [year, month, day] = event.event_date.split("-").map(Number);

  // Helper functions for time formatting
  function am_pm(value: string | undefined): string {
    // Split the time
    if (value) {
      let time_split: string[] = value.split(":");
      if (Number(time_split[0]) >= 12) {
        return "PM";
      } else {
        return "AM";
      }
    } else {
      return "No Time Value!";
    }
  }

  function military_to_normal(value: string | undefined): string {
    // Split the time
    if (value) {
      let time_split: string[] = value.split(":");

      // If the first number is greater than 12, subtract 12 from it
      if (Number(time_split[0]) > 12) {
        let formatted_hour: number = Number(time_split[0]) - 12;
        time_split[0] = String(formatted_hour);
      }

      return Number(time_split[0]) + ":" + time_split[1];
    } else {
      return "No Time Value!";
    }
  }

  return (
    <div
      className="p-4 text-white rounded-sm hover:cursor-pointer"
      style={{
        backgroundColor: event.event_color,
      }}
      onClick={() => {
        setOpen(true);
        setEvent(event);
      }}
    >
      {/* Event Title */}
      <div className="text-xl font-semibold mb-2">{event.event_title}</div>
      {/* Event Date and Time */}
      <div className="text-sm flex flex-col gap-1">
        <div className="flex flex-row gap-1 items-center">
          <Calendar />
          <div>
            {new Date(year, month - 1, day).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <Clock />
          <div className="flex flex-row gap-1">
            {event?.event_start == "00:00" && event?.event_end == "00:00" ? (
              <div>All Day</div>
            ) : (
              <div className="flex flex-row gap-1">
                <div>
                  {military_to_normal(event?.event_start)}{" "}
                  {am_pm(event?.event_start)}
                </div>
                <div>-</div>
                <div>
                  {military_to_normal(event?.event_end)}{" "}
                  {am_pm(event?.event_end)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="text-sm mt-4">
        <i>Event Description:</i> {event.event_desc}
      </div>
      <div className="flex justify-end text-sm font-light mt-2">
        <i>Event Created By</i>: {event.author_first_name}{" "}
        {event.author_last_name}
      </div>

      {/* Show a preview of the comments */}
      <MonthPreviewComments eventId={event.event_id} open={open} />
    </div>
  );
};

export default MonthEventPreview;
