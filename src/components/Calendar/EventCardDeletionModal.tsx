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

type EventCardDeletionModalProps = {
  event_id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEventPreviewOpen: Dispatch<SetStateAction<boolean>>;
  getWeek: () => void;
};

const EventCardDeletionModal = ({
  event_id,
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
        <AlertDialogFooter>
          <AlertDialogCancel
            className="hover:cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="hover:cursor-pointer"
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
