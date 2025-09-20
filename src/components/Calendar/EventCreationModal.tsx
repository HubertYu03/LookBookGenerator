// Importing UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronDownIcon, Plus } from "lucide-react";

// Importing global types
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Event, User } from "@/types/global";
import type { DateRange } from "react-day-picker";

// Importing custom components
import EventColorPicker from "./EventColorPicker";

// Importing dependencies
import { v4 } from "uuid";

// Importing database
import { supabase } from "@/lib/supabaseClient";

type EventCreationModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getWeek: () => void;
  getMonthEvents?: () => void;
  presetDate?: Date;
  user: User;
};

const EventCreationModal = ({
  open,
  setOpen,
  getWeek,
  getMonthEvents,
  presetDate,
  user,
}: EventCreationModalProps) => {
  // Event States
  const [eventTitle, setEventTitle] = useState<string>();

  // Date states
  // If the user wants to select a range of dates, you would have to choose between range or single
  const [pickingRange, setPickingRange] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [eventDesc, setEventDesc] = useState<string>();

  // Time states
  const [allDay, setAllDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const [eventColor, setEventColor] = useState<string | undefined>();

  // Helper function to create the event
  async function create_event() {
    // Check each field based on the order
    toast.dismiss();

    if (!eventTitle) {
      toast.warning("Please enter an event title!");
      return;
    }

    // Check to see if it was a date range input
    if (pickingRange) {
      if (!dateRange.from && !dateRange.to) {
        toast.warning("Please select a date range!");
        return;
      }
    } else {
      if (!date) {
        toast.warning("Please select a date!");
        return;
      }
    }

    if (!eventDesc) {
      toast.warning("Please enter an event description!");
      return;
    }

    if (!startTime && !allDay) {
      toast.warning("Please select a start time!");
      return;
    }

    if (!endTime && !allDay) {
      toast.warning("Please select an end time!");
      return;
    }

    if (!eventColor) {
      toast.warning("Please select an event color!");
      return;
    }

    // Check if the times are correct
    if (!allDay) {
      const start: number = Number(startTime?.split(":")[0]);
      const end: number = Number(endTime?.split(":")[0]);

      if (start > end) {
        toast.warning("Invalid start and end times!");
        return;
      }
    }

    // Create an new event type and add it to the database
    // Check to see if it was multiple dates
    if (pickingRange) {
      // Insert multiple dates
      if (dateRange.from && dateRange.to) {
        let dates: Date[] = [];

        // Get all the dates in between the date range
        const current: Date = new Date(dateRange.from as Date);
        while (current <= dateRange?.to) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }

        // Once we get all the dates, we then create an event list

        // Unique ID to group the events together
        const group_id: string = v4();

        let events: Event[] = [];
        dates.map((date) => {
          let new_event: Event = {
            event_id: v4(),
            created_at: new Date(),
            event_date: `${date.getFullYear() ?? ""}-${
              date.getMonth() !== undefined ? date.getMonth() + 1 : ""
            }-${date.getDate() ?? ""}`,
            event_title: eventTitle,
            event_desc: eventDesc,
            author_first_name: user.first_name,
            author_last_name: user.last_name,
            author_id: localStorage.getItem("PlayletUserID") as string,
            event_color: eventColor,
            event_start: allDay ? "00:00" : (startTime as string),
            event_end: allDay ? "00:00" : (endTime as string),
            whole_day: false,
            group_id: group_id,
          };

          events.push(new_event);
        });

        // Insert the new event into the database
        const { error } = await supabase.from("events").insert(events).select();

        if (error) {
          console.log(error);
          return;
        } else {
          // Send a success message and refetch all the events
          toast.success("Events created successfully!");
          setOpen(false);
          resetForm();
          getWeek();
          if (getMonthEvents) getMonthEvents();
        }
      }
    } else {
      // Inserting a single event into the database

      let new_event: Event = {
        event_id: v4(),
        created_at: new Date(),
        event_date: `${date?.getFullYear() ?? ""}-${
          date?.getMonth() !== undefined ? date.getMonth() + 1 : ""
        }-${date?.getDate() ?? ""}`,
        event_title: eventTitle,
        event_desc: eventDesc,
        author_first_name: user.first_name,
        author_last_name: user.last_name,
        author_id: localStorage.getItem("PlayletUserID") as string,
        event_color: eventColor,
        event_start: allDay ? "00:00" : (startTime as string),
        event_end: allDay ? "00:00" : (endTime as string),
        whole_day: false,
        group_id: null,
      };

      // Insert the new event into the database
      const { error } = await supabase
        .from("events")
        .insert(new_event)
        .select();

      if (error) {
        console.log(error);
        return;
      } else {
        // Send a success message and refetch all the events
        toast.success("Event created successfully!");
        setOpen(false);
        resetForm();
        getWeek();
        if (getMonthEvents) getMonthEvents();
      }
    }
  }

  // Helper function to reset form
  function resetForm() {
    setEventTitle("");
    setEventDesc("");
    setDate(undefined);
    setDateRange({ from: undefined, to: undefined });
    setStartTime("");
    setEndTime("");
    setEventColor(undefined);
    setAllDay(false);
    setPickingRange(false);
  }

  useEffect(() => {
    // If there is a preset date that exists
    if (presetDate) {
      setDate(presetDate);
    }
  }, [presetDate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Create Event</DialogTitle>
          <DialogDescription>
            Creating an event for all users to see.
          </DialogDescription>
        </DialogHeader>

        {/* Event Creation Fields */}

        {/* Event Name */}
        <div className="grid w-full items-center gap-3">
          <Label>
            Event Title
            <span className="text-red-500">{eventTitle ? "" : "*"}</span>
          </Label>
          <Input
            type="text"
            placeholder="Event Title..."
            onChange={(e) => {
              setEventTitle(e.target.value);
            }}
          />
        </div>

        {/* Event Date */}
        <div className="grid w-full items-center gap-3">
          <div className="flex flex-row justify-between">
            <Label>
              {pickingRange ? (
                <div>
                  Event Date Range{" "}
                  <span className="text-red-500">
                    {dateRange.from && dateRange.to ? "" : "*"}
                  </span>
                </div>
              ) : (
                <div>
                  Event Date{" "}
                  <span className="text-red-500">{date ? "" : "*"}</span>
                </div>
              )}
            </Label>

            {/* Button to switch from single date to date range */}
            <div className="flex flex-row gap-2">
              <Label className="text-xs">Date Range Selection</Label>
              <Switch
                checked={pickingRange}
                onCheckedChange={() => setPickingRange(!pickingRange)}
              />
            </div>
          </div>
          {pickingRange ? (
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="font-normal sm:w-1/2 hover:cursor-pointer"
                >
                  {dateRange?.from && dateRange?.to
                    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                    : "Select Dates"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <CalendarUI
                  mode="range"
                  captionLayout="dropdown"
                  selected={dateRange}
                  onSelect={(range) => {
                    console.log(range);
                    setDateRange(range ?? { from: undefined, to: undefined });
                  }}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="font-normal sm:w-1/2 hover:cursor-pointer"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <CalendarUI
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Event Description */}
        <div className="grid w-full items-center gap-3">
          <Label>
            Event Description
            <span className="text-red-500">{eventDesc ? "" : "*"}</span>
          </Label>
          <Textarea
            placeholder="Event Description..."
            onChange={(e) => {
              setEventDesc(e.target.value);
            }}
          />
        </div>

        {/* If the user wants to select all day */}
        <div className="flex flex-row gap-2">
          <Label>All Day</Label>
          <Switch checked={allDay} onCheckedChange={() => setAllDay(!allDay)} />
        </div>

        {/* Event Times */}
        {!allDay && (
          <div className="flex flex-row gap-5">
            <div className="grid w-1/3 sm:w-full items-center gap-3">
              <Label>
                Start Time
                <span className="text-red-500">{startTime ? "" : "*"}</span>
              </Label>
              <Input
                type="time"
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
              />
            </div>

            <div className="grid w-1/3 sm:w-full items-center gap-3">
              <Label>
                End Time
                <span className="text-red-500">{endTime ? "" : "*"}</span>
              </Label>
              <Input
                type="time"
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
              />
            </div>
          </div>
        )}

        {/* Color Picker */}
        <div className="grid w-full items-center gap-3">
          <Label>
            Event Color
            <span className="text-red-500">{eventColor ? "" : "*"}</span>
          </Label>
          <EventColorPicker setColor={setEventColor} />

          <div className="flex flex-row gap-2">
            <Label>Selected Color:</Label>
            <div className="w-5 h-5" style={{ backgroundColor: eventColor }} />
          </div>
        </div>

        {/* Create Button */}
        <Button onClick={create_event} className="hover:cursor-pointer">
          Create Event <Plus />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
