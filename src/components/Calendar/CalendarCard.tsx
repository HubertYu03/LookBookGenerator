// Importing UI Components
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

// Global types
import type { Calendar } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing Database
import { supabase } from "@/lib/supabaseClient";

// Importing Icons
import { CircleAlert, Eye, EyeOff, Pencil, Trash } from "lucide-react";

type CalendarCardProps = {
  calendar_id: string;
  getCalendars: () => void;
};

const CalendarCard = ({ calendar_id, getCalendars }: CalendarCardProps) => {
  // Current Calendar
  const [calendar, setCalendar] = useState<Calendar>();

  // Navigation Component
  const navigate = useNavigate();

  // States for editing the calendar
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [newCalendarName, setNewCalendarName] = useState<string>();
  const [newCalendarDesc, setNewCalendarDesc] = useState<string>();
  const [newCalenderPrivate, setNewCalendarPrivate] = useState<boolean>();

  async function get_calendar() {
    let { data: calendar, error } = await supabase
      .from("calendar")
      .select("*")
      .eq("calendar_id", calendar_id);

    if (error) {
      console.log(error);
      return;
    }

    if (calendar) setCalendar(calendar[0]);
  }

  // Function to delete the calendar
  async function delete_calendar() {
    // Delete the calendar from the database
    const { error: calendar_remove_error } = await supabase
      .from("calendar")
      .delete()
      .eq("calendar_id", calendar_id);

    if (calendar_remove_error) {
      console.log(calendar_remove_error);
      return;
    }

    const { error } = await supabase.rpc("remove_calendar_id_from_users", {
      calendar_id_to_remove: calendar_id,
    });

    if (error) {
      console.log(error);
      return;
    }

    // Fetch the calendars again once they are removed
    getCalendars();
    toast.success("Calendar successfully deleted.");
  }

  // Function to update the calendar
  async function edit_comment() {
    const { error } = await supabase
      .from("calendar")
      .update({
        calendar_name: newCalendarName,
        calendar_desc: newCalendarDesc,
        private: newCalenderPrivate,
      })
      .eq("calendar_id", calendar_id)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    toast.success("Calendar Updated Successfully!");
    setOpenEdit(false);
    await get_calendar();
  }

  useEffect(() => {
    get_calendar();
  }, []);

  // Helper function to set the initial edit values
  function set_edit_values() {
    if (calendar) {
      setNewCalendarName(calendar.calendar_name);
      setNewCalendarDesc(calendar.calendar_desc);
      setNewCalendarPrivate(calendar.private);
    }
  }

  useEffect(() => {
    set_edit_values();
  }, [calendar]);

  return (
    <Card className="w-full flex flex-col justify-between">
      <CardHeader>
        {/* Calendar Title and Private ToolTip */}
        <CardTitle className="flex flex-row items-center justify-between">
          <div>{calendar?.calendar_name}</div>

          <Tooltip>
            <TooltipTrigger>
              {calendar?.private ? <EyeOff /> : <Eye />}
            </TooltipTrigger>
            <TooltipContent>
              {calendar?.private ? "Private" : "Public"}
            </TooltipContent>
          </Tooltip>
        </CardTitle>

        <CardDescription>
          {calendar?.calendar_desc ? (
            calendar.calendar_desc
          ) : (
            <i>No calendar description</i>
          )}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-row gap-2 justify-end">
        <Button
          className="hover:cursor-pointer"
          onClick={() => navigate(`/calendar/${calendar?.calendar_id}`)}
        >
          View
        </Button>

        {/* Button to edit the calendar */}
        <Button
          onClick={() => {
            setOpenEdit(true);
            set_edit_values();
          }}
          className="hover:cursor-pointer"
        >
          <Pencil />
        </Button>

        {/* Edit Calendar Modal */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Calendar</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            {/* Calendar Name Input */}
            <div className="flex flex-col gap-2 mb-2">
              <Label>Calendar Name</Label>
              <Input
                type="text"
                placeholder="Calendar Name..."
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <Label>Calendar Description (optional)</Label>
              <Textarea
                placeholder="e.g. 'What is the purpose of this calendar?' "
                value={newCalendarDesc}
                onChange={(e) => setNewCalendarDesc(e.target.value)}
              />
            </div>

            {/* Calendar Visibility */}
            <div className="flex flex-row items-center gap-2 mt-2">
              <Label>Private Calendar</Label>
              <Switch
                checked={newCalenderPrivate}
                onCheckedChange={() => {
                  setNewCalendarPrivate(!newCalenderPrivate);
                }}
              />
            </div>
            <div className="text-gray-500 text-sm flex flex-row items-center gap-2">
              <CircleAlert />
              <div>Private calendars cannot be viewed by other people!</div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="destructive" className="hover:cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button className="hover:cursor-pointer" onClick={edit_comment}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Calendar Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="hover:cursor-pointer">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Calendar Warning</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                calendar, all the events associated with the calendar, and all
                comments associated with those events.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={delete_calendar}>
                Delete Calendar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default CalendarCard;
