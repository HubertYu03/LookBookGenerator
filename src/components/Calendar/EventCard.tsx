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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ChevronDownIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import EventCardDeletionModal from "./EventCardDeletionModal";
import EventColorPicker from "./EventColorPicker";
import { Label } from "../ui/label";

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
  getWeek: () => void;
};

const EventCard = ({
  open,
  setOpen,
  event,
  author,
  user,
  getWeek,
}: EventCardProps) => {
  // State for pin button
  const [pinned, setPinned] = useState<boolean>(false);

  // Editing states
  const [editing, setEditing] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDesc, setNewEventDesc] = useState<string>("");
  const [newEventStart, setNewEventStart] = useState<string>("");
  const [newEventEnd, setNewEventEnd] = useState<string>("");
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [newEventDate, setNewEventDate] = useState<Date>();
  const [newEventColor, setNewEventColor] = useState<string>();

  // State for deletion modal
  const [openDelete, setOpenDelete] = useState<boolean>(false);

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

  // Helper function to save the new edits
  async function edit_event() {
    // Clear all the toasts
    toast.dismiss();

    // Handle missing text errors
    if (!newEventTitle) {
      toast.warning("Please enter an event title!");
      return;
    }

    if (!newEventStart) {
      toast.warning("Please enter an start date!");
      return;
    }

    if (!newEventEnd) {
      toast.warning("Please enter an end date!");
      return;
    }

    if (!newEventDesc) {
      toast.warning("Please enter an event description!");
      return;
    }

    if (!newEventDate) {
      toast.warning("Please enter an event date!");
      return;
    }

    // Check if there actually were any changes made
    if (
      newEventTitle == event?.event_title &&
      newEventStart == event.event_start &&
      newEventEnd == event.event_end &&
      newEventDesc == event.event_desc &&
      newEventDate.toISOString().split("T")[0] == event.event_date &&
      newEventColor == event.event_color
    ) {
      toast.warning("No changes have been made!");
      return;
    }

    // If the code has made it to this point, update the event
    const updated_event: Event = {
      event_id: event?.event_id as string,
      created_at: event?.created_at as Date,
      event_date: newEventDate.toISOString().split("T")[0],
      event_title: newEventTitle,
      event_desc: newEventDesc,
      event_author: localStorage.getItem("PlayletUserID") as string,
      event_color: newEventColor as string,
      event_start: newEventStart,
      event_end: newEventEnd,
    };

    const { error } = await supabase
      .from("events")
      .update(updated_event)
      .eq("event_id", event?.event_id as string)
      .select();

    if (error) {
      console.log(error);
    }

    toast.success("Event updated successfully!");
    setEditing(false);
    setOpen(false);
    getWeek();
  }

  // When the page is mounted
  useEffect(() => {
    // Check the pinned state
    if (open && event && user) {
      check_pinned_events();
    }
  }, [open, event, user]);

  // Rendering the editing states
  useEffect(() => {
    if (editing && event?.event_title) {
      setNewEventTitle(event.event_title);
      setNewEventDesc(event.event_desc);
      setNewEventStart(event.event_start);
      setNewEventEnd(event.event_end);

      const [year, month, day] = event.event_date.split("-").map(Number);
      setNewEventDate(new Date(year, month - 1, day));
    }
  }, [editing, event]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setEditing(false);
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            {editing ? (
              <>
                {/* Editing State */}
                <div
                  className="rounded-full h-5 w-5"
                  style={{
                    backgroundColor: event?.event_color,
                  }}
                />
                <Input
                  type="text"
                  className="w-10/12"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </>
            ) : (
              <>
                {/* Normal State */}
                <div
                  className="rounded-full h-5 w-5"
                  style={{
                    backgroundColor: event?.event_color,
                  }}
                />
                <div className="text-3xl ">{event?.event_title}</div>
              </>
            )}
          </DialogTitle>

          {/* Date and Time */}
          <div className="text-sm text-gray-500 flex flex-col gap-2">
            {/* Time */}
            <div className="flex flex-row items-center gap-2">
              <Clock />
              {editing ? (
                <>
                  {/* Editing State */}
                  <div className="flex flex-row gap-1">
                    <Input
                      type="time"
                      value={newEventStart}
                      onChange={(e) => setNewEventStart(e.target.value)}
                    />
                    <Input
                      type="time"
                      value={newEventEnd}
                      onChange={(e) => setNewEventEnd(e.target.value)}
                    />
                  </div>
                </>
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

            {/* Date */}
            <div className="flex flex-row items-center gap-2">
              <CalendarDays />
              {editing ? (
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {newEventDate
                        ? newEventDate.toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={newEventDate}
                      captionLayout="dropdown"
                      onSelect={(new_date) => {
                        setNewEventDate(new_date);
                        setOpenDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div>{format_date(event?.event_date)}</div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Event Description */}
        <div>
          <div className="text-gray-500 text-sm">Event Description:</div>
          {editing ? (
            <Textarea
              value={newEventDesc}
              onChange={(e) => setNewEventDesc(e.target.value)}
            />
          ) : (
            <div>{event?.event_desc}</div>
          )}
        </div>

        {editing && (
          <>
            <EventColorPicker setColor={setNewEventColor} />
            <div className="flex flex-row gap-2">
              <Label>Selected Color:</Label>
              <div
                className="w-5 h-5"
                style={{ backgroundColor: newEventColor }}
              />
            </div>
          </>
        )}

        <DialogFooter>
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-500">
              Event Created By: {author?.first_name} {author?.last_name}
            </div>

            {!editing ? (
              <div className="flex flex-row justify-end">
                <EventCardButton
                  ButtonIcon={pinned ? PinOff : Pin}
                  buttonFunction={pin_event}
                  tooltip={pinned ? "Unpin" : "Pin"}
                />
                {event?.event_author ==
                  localStorage.getItem("PlayletUserID") && (
                  <>
                    <EventCardButton
                      ButtonIcon={Pencil}
                      buttonFunction={() => setEditing(!editing)}
                      tooltip="Edit"
                    />
                    <EventCardButton
                      ButtonIcon={Trash}
                      buttonFunction={() => setOpenDelete(true)}
                      tooltip="Delete"
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-row justify-end gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="hover:cursor-pointer"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="hover:cursor-pointer"
                  onClick={edit_event}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      <EventCardDeletionModal
        event_id={event?.event_id as string}
        open={openDelete}
        setOpen={setOpenDelete}
        setEventPreviewOpen={setOpen}
        getWeek={getWeek}
      />
    </Dialog>
  );
};

export default EventCard;
