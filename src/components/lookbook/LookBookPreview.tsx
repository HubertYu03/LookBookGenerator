// Importing global types
import type { LookBook } from "@/types/global";

// Importing UI Components
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
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
import { SquarePen, Trash } from "lucide-react";

// Importing dependencies
import { useNavigate } from "react-router-dom";

type LookBookPreviewProps = {
  lookbook: LookBook;
};

const LookBookPreview = ({ lookbook }: LookBookPreviewProps) => {
  // Navigate state object
  const navigate = useNavigate();

  // Funciton to navigate to selected look book
  function handle_lookbook_edit() {
    navigate(`/lookbookgenerator/${lookbook.lookbook_id}`);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="text-3xl font-semibold">{lookbook.project_name}</div>
          <div className="text-right text-gray-500">
            Created: {new Date(lookbook.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-row justify-between items-end">
        <div className="text-gray-500">
          Last Edited: {new Date(lookbook.last_edited).toLocaleDateString()}
        </div>
        <div className="flex gap-3">
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
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    console.log("Delete", lookbook.lookbook_id);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            className="hover:cursor-pointer"
            onClick={handle_lookbook_edit}
          >
            Edit <SquarePen />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LookBookPreview;
