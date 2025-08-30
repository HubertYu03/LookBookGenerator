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
import { ChevronDownIcon, Plus } from "lucide-react";

// Importing global types
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Event } from "@/types/global";

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
};

const EventCreationModal = ({
  open,
  setOpen,
  getWeek,
}: EventCreationModalProps) => {
  // Event States
  const [eventTitle, setEventTitle] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [eventDesc, setEventDesc] = useState<string>();
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

    if (!date) {
      toast.warning("Please select a date!");
      return;
    }

    if (!eventDesc) {
      toast.warning("Please enter an event description!");
      return;
    }

    if (!startTime) {
      toast.warning("Please select a start time!");
      return;
    }

    if (!endTime) {
      toast.warning("Please select an end time!");
      return;
    }

    if (!eventColor) {
      toast.warning("Please select an event color!");
      return;
    }

    // Create an new event type and add it to the database
    let new_event: Event = {
      event_id: v4(),
      created_at: new Date(),
      event_date: date.toISOString().split("T")[0],
      event_title: eventTitle,
      event_desc: eventDesc,
      event_author: localStorage.getItem("PlayletUserID") as string,
      event_color: eventColor,
      event_start: startTime,
      event_end: endTime,
    };

    // Insert the new event into the database
    const { error } = await supabase.from("events").insert(new_event).select();

    if (error) {
      console.log(error);
      return;
    } else {
      // Send a success message and refetch all the events
      toast.success("Event created successfully!");
      setOpen(false);
      getWeek();
    }
  }

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
          <Label>
            Event Date
            <span className="text-red-500">{date ? "" : "*"}</span>
          </Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="font-normal w-1/2 hover:cursor-pointer"
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

        {/* Event Times */}
        <div className="flex flex-row gap-5">
          <div className="grid w-full items-center gap-3">
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

          <div className="grid w-full items-center gap-3">
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

        {/* Color Picker */}
        <div className="grid w-full items-center gap-3">
          <Label>
            Event Color
            <span className="text-red-500">{eventColor ? "" : "*"}</span>
          </Label>
          <EventColorPicker setColor={setEventColor} />

          <div className="flex flex-row gap-2">
            <Label>Selected Color:</Label>
            <div
              className="w-5 h-5"
              style={{ backgroundColor: eventColor }}
            ></div>
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
