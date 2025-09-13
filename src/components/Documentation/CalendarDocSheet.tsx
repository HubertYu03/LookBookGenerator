// Importing Global Types
import type { Dispatch, SetStateAction } from "react";

// Importing UI Components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

type CalendarDocSheetProps = {
  open: boolean;
  setOpenChange: Dispatch<SetStateAction<boolean>>;
};

const CalendarDocSheet = ({ open, setOpenChange }: CalendarDocSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CalendarDocSheet;
