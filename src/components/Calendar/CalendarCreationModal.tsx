// Importing UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

// Importing Dependencies
import { useState } from "react";
import { v4 } from "uuid";

// Importing Icons
import { CircleAlert } from "lucide-react";

// Importing Global Types
import type { Calendar } from "@/types/global";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type CalendarCreationModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  authorId: string;
  setCalendar: React.Dispatch<React.SetStateAction<string[]>>;
  calendars: string[];
};

const CalendarCreationModal = ({
  open,
  setOpen,
  authorId,
  setCalendar,
  calendars,
}: CalendarCreationModalProps) => {
  // States for adding a new calendar
  const [calendarName, setCalendarName] = useState<string>("");
  const [calendarDesc, setCalendarDesc] = useState<string>();
  const [privateView, setPrivateView] = useState<boolean>(true);

  // Function to create Calendar
  async function create_calendar() {
    if (!calendarName) {
      toast.warning("Please input a calendar name!");
      return;
    }

    // Generate a new calendar ID
    const new_calendar_id: string = v4();

    // Add calendar to calendar database
    const new_calendar: Calendar = {
      calendar_id: new_calendar_id,
      calendar_name: calendarName,
      created_at: new Date(),
      calendar_desc: calendarDesc,
      author_id: authorId,
      personal: false,
      private: privateView,
    };

    const { error } = await supabase
      .from("calendar")
      .insert(new_calendar)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    // Add the new calendar to users calendar list
    let current_calendars: string[] = calendars;
    current_calendars.push(new_calendar_id);

    const { error: update_user_calendar_error } = await supabase
      .from("users")
      .update({ calendar_ids: current_calendars })
      .eq("user_id", authorId)
      .select();

    if (update_user_calendar_error) {
      console.log(update_user_calendar_error);
      return;
    }

    toast.success("Calendar successfully created!");

    // Refetch the calendars and close the modal
    setCalendar(current_calendars);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* Modal header */}
        <DialogHeader>
          <DialogTitle className="text-3xl">Create Calendar</DialogTitle>
          <DialogDescription>
            Create a new calendar for specific projects or to share with others!
          </DialogDescription>
        </DialogHeader>

        {/* Calendar Name Input */}
        <div className="flex flex-col gap-2 mb-2">
          <Label>
            Calendar Name
            <span className={!calendarName ? "text-red-500" : "invisible"}>
              *
            </span>
          </Label>
          <Input
            type="text"
            placeholder="Calendar Name..."
            value={calendarName}
            onChange={(e) => setCalendarName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <Label>Calendar Description (optional)</Label>
          <Textarea
            placeholder="e.g. 'What is the purpose of this calendar?' "
            value={calendarDesc}
            onChange={(e) => setCalendarDesc(e.target.value)}
          />
        </div>

        {/* Calendar Visibility */}
        <div className="flex flex-row items-center gap-2 mt-2">
          <Label>Private Calendar</Label>
          <Switch
            checked={privateView}
            onCheckedChange={() => setPrivateView(!privateView)}
          />
        </div>
        <div className="text-gray-500 text-sm flex flex-row items-center gap-2">
          <CircleAlert />
          <div>Private calendars cannot be viewed by other people!</div>
        </div>

        <Button className="hover:cursor-pointer" onClick={create_calendar}>
          Create Calendar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarCreationModal;
