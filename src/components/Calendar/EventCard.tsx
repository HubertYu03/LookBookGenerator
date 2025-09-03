import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { toast } from "sonner";

// Importing global types
import type { Event, User } from "@/types/global";

// Importing dependencies
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// Import Database
import { supabase } from "@/lib/supabaseClient";

// Importing icons
import {
  Clock,
  CalendarDays,
  Pin,
  Trash,
  Pencil,
  PinOff,
  type LucideIcon,
} from "lucide-react";

// Custom components for button
type EventCardButtonProps = {
  ButtonIcon: LucideIcon;
  buttonFunction: () => void;
  tooltip: string;
};

const EventCardButton = ({
  ButtonIcon,
  buttonFunction,
  tooltip,
}: EventCardButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="hover:cursor-pointer"
          onClick={buttonFunction}
          tabIndex={-1}
        >
          <ButtonIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Event Card Component
type EventCardProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  event: Event | undefined;
  author: User | undefined;
  user: User | undefined;
};

const EventCard = ({ open, setOpen, event, author, user }: EventCardProps) => {
  // State for pin button
  const [pinned, setPinned] = useState<boolean>(false);

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

  function format_date(date: string | undefined): string {
    if (date) {
      // Manually parse as local date
      const [year, month, day] = date.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);

      return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return "No Valid Date";
  }

  // Helper function to check if the current event is pinned
  async function check_pinned_events() {
    if (event?.event_id && user?.user_id) {
      let { data: pinned_events, error } = await supabase
        .from("users")
        .select("pinned_events")
        .eq("user_id", user.user_id);

      if (error) {
        console.log(error);
      }

      // Check if the current event is pinned
      if (pinned_events) {
        setPinned(pinned_events[0].pinned_events.includes(event.event_id));
      }
    }
  }

  // Event Card Interaction Buttons
  async function pin_event() {
    // Clear all toasts
    toast.dismiss();

    if (!event?.event_id || !user?.user_id) return;

    const newPinned = !pinned; // Flip local pinned state
    setPinned(newPinned);

    const newPinnedEvents = newPinned
      ? [...user.pinned_events, event.event_id]
      : user.pinned_events.filter((id) => id !== event.event_id);

    const { error } = await supabase
      .from("users")
      .update({ pinned_events: newPinnedEvents })
      .eq("user_id", user.user_id);

    if (error) {
      console.error(error);
      toast.error("Failed to update pinned events");
      setPinned(!newPinned); // 🔁 Revert UI if update failed
      return;
    }

    toast.success(
      newPinned ? "Event successfully pinned!" : "Event successfully unpinned!"
    );
  }

  useEffect(() => {
    // Check the pinned state
    if (open && event && user) {
      check_pinned_events();
    }
  }, [open, event, user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <div
              className="rounded-full h-5 w-5"
              style={{
                backgroundColor: event?.event_color,
              }}
            />
            <div className="text-3xl ">{event?.event_title}</div>
          </DialogTitle>

          {/* Date and Time */}
          <div className="text-sm text-gray-500 flex flex-col gap-2">
            {/* Time */}
            <div className="flex flex-row items-center gap-2">
              <Clock />
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
            </div>

            {/* Date */}
            <div className="flex flex-row items-center gap-2">
              <CalendarDays />
              {format_date(event?.event_date)}
            </div>
          </div>
        </DialogHeader>

        {/* Event Description */}
        <div>
          <div className="text-gray-500 text-sm">Event Description:</div>
          <div>{event?.event_desc}</div>
        </div>

        <DialogFooter>
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-500">
              Event Created By: {author?.first_name} {author?.last_name}
            </div>

            <div className="flex flex-row justify-end">
              <EventCardButton
                ButtonIcon={pinned ? PinOff : Pin}
                buttonFunction={pin_event}
                tooltip={pinned ? "Unpin" : "Pin"}
              />
              <EventCardButton
                ButtonIcon={Pencil}
                buttonFunction={() => {}}
                tooltip="Edit"
              />
              <EventCardButton
                ButtonIcon={Trash}
                buttonFunction={() => {}}
                tooltip="Delete"
              />
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventCard;
