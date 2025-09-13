import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Importing global types
import type { Dispatch, SetStateAction } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

type EventCardDeletionModalProps = {
  event_id: string;
  event_group_id: string | null | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEventPreviewOpen: Dispatch<SetStateAction<boolean>>;
  getWeek: () => void;
};

const EventCardDeletionModal = ({
  event_id,
  event_group_id,
  open,
  setOpen,
  setEventPreviewOpen,
  getWeek,
}: EventCardDeletionModalProps) => {
  // Helper function to delete the event from the database
  async function delete_event() {
    // Clear any toasts
    toast.dismiss();

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("event_id", event_id);

    if (error) {
      console.log(error);
    }

    toast.success("Successfully deleted event!");
    setOpen(false);
    setEventPreviewOpen(false);
    getWeek();
  }

  async function delete_event_group() {
    // Clear any toasts
    toast.dismiss();

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("group_id", event_group_id);

    if (error) {
      console.log(error);
    }

    toast.success("Successfully deleted event group!");
    setOpen(false);
    setEventPreviewOpen(false);
    getWeek();
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {event_group_id && (
          <div className="mt-5 flex flex-row gap-1 text-sm text-red-400">
            <CircleAlert />
            <div>
              This event is linked to group of events. You have the option to
              delete all the events.
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            className="hover:cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          {event_group_id && (
            <AlertDialogAction
              className="hover:cursor-pointer"
              onClick={delete_event_group}
            >
              Delete All Events
            </AlertDialogAction>
          )}
          <AlertDialogAction
            className="hover:cursor-pointer bg-red-600  hover:bg-red-500"
            onClick={delete_event}
          >
            Delete Event
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventCardDeletionModal;
