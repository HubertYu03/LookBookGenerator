// Importing global types
import type { LocationBook } from "@/types/global";

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
  location_book: LocationBook;
};

const LocationBookPreview = ({ location_book }: LookBookPreviewProps) => {
  // Navigate state object
  const navigate = useNavigate();

  // Funciton to navigate to selected look book
  function handle_lookbook_edit() {
    navigate(`/locationbookgenerator/${location_book.locationbook_id}`);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="text-3xl font-semibold">
            {location_book.project_name}
          </div>
          <div className="text-right text-gray-500">
            Created: {new Date(location_book.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-row justify-between items-end">
        <div className="text-gray-500">
          Last Edited:{" "}
          {new Date(location_book.last_edited).toLocaleDateString()}
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
                    console.log("Delete", location_book.locationbook_id);
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

export default LocationBookPreview;
