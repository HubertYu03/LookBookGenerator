// Importing UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// Importing dependencies
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

// Importing Icons
import { Menu, Share, Trash } from "lucide-react";
import { toast } from "sonner";
import { delete_book } from "@/lib/utils";

type LookBookMenuButtonProps = {
  bucket: string;
  table_name: string;
  id_column_name: string;
  column_name: string;
  id: string;
  book_type: string;
  path: string;
  disabled: boolean;
  exists: boolean;
};

const LookBookMenuButton = ({
  bucket,
  table_name,
  id_column_name,
  column_name,
  id,
  book_type,
  path,
  disabled,
  exists,
}: LookBookMenuButtonProps) => {
  // Get the current path
  const location = useLocation();

  // Get the navigation object
  const navigate = useNavigate();

  // Get full pathname + query
  const fullPath =
    window.location.origin +
    location.pathname +
    location.search +
    location.hash;

  // Dialog states
  const [open, setOpen] = useState<boolean>(false);

  // Copy link text button
  const input_ref = useRef<HTMLInputElement>(null);

  // Function to handle the link copy
  async function handle_copy() {
    const text = input_ref.current?.value;
    if (text) {
      await navigator.clipboard.writeText(text);
      toast.success("Link Copied to Clipboard!");
    }
  }

  // Function to delete the book and navigate to respective book page
  async function delete_book_wrapper() {
    await delete_book(bucket, table_name, id_column_name, column_name, id);
    navigate(path);
  }

  // Function to handle sharing a link
  const handle_share_link = () => {
    // Clear toasts
    toast.dismiss();

    if (exists) {
      setOpen(true);
    } else {
      // If the book does not exist, you cannot share the link
      toast.warning("You must save progress before sharing link!");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="hover:cursor-pointer"
          disabled={disabled}
        >
          More Actions
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-50 gap-3">
        {/* Sharing Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={handle_share_link}
          >
            Share <Share />
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Share Link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this LookBook.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={fullPath}
                  readOnly
                  ref={input_ref}
                />
              </div>
            </div>
            <DialogFooter className="justify-end">
              <Button
                variant="outline"
                onClick={handle_copy}
                className="hover:cursor-pointer"
              >
                Copy Link
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="hover:cursor-pointer"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="hover:cursor-pointer">
              Delete <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this{" "}
                <b>{book_type}</b> and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:cursor-pointer hover:bg-red-700"
                onClick={delete_book_wrapper}
              >
                Delete <Trash />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
};

export default LookBookMenuButton;
