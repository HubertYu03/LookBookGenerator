// Importing UI Components
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

// Importing dependencies
import { useNavigate } from "react-router-dom";

// Importing Icons
import { AlertTriangle, Trash } from "lucide-react";
import { toast } from "sonner";
import { delete_book } from "@/lib/utils";
import { useState } from "react";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

type MobileDeleteProps = {
  bucket: string;
  table_name: string;
  id_column_name: string;
  column_name: string;
  id: string;
  book_type: string;
  path: string;
  exists: boolean;
};

const MobileDelete = ({
  bucket,
  table_name,
  id_column_name,
  column_name,
  id,
  book_type,
  path,
  exists,
}: MobileDeleteProps) => {
  // Get the navigation object
  const navigate = useNavigate();

  // Function to delete the book and navigate to respective book page
  async function delete_book_wrapper() {
    if (exists) {
      await delete_book(bucket, table_name, id_column_name, column_name, id);
      navigate(path);
    } else {
      // If the book does not exist, you cannot delete it
      toast.warning(`You must save progress before deleting ${book_type}`);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex flex-row gap-2 active:opacity-50">
          <Trash />
          <div>Delete Lookbook</div>
        </div>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            onClick={async () => {
              await delete_book_wrapper();
            }}
          >
            Delete <Trash />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MobileDelete;
