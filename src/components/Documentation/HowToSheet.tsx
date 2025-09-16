// Importing UI Components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Dispatch, SetStateAction } from "react";

// Importing custom components
import LookBookDocumentaiton from "./LookBookDocumentaiton";
import LocationBookDocumentation from "./LocationBookDocumentation";

type HowToSheetProps = {
  open: boolean;
  setOpenChange: Dispatch<SetStateAction<boolean>>;
  initial: string;
};

const HowToSheet = ({ open, setOpenChange, initial }: HowToSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpenChange}>
      <SheetContent className="flex flex-col h-screen duration-150 w-[85vw] max-w-[85vw] sm:w-[700px] sm:max-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Book Editor Documentation</SheetTitle>
          <SheetDescription>
            Here is is a how guide on how to use the book editors! You can
            select which type of book you are working on to view more specific
            steps.
          </SheetDescription>

          {/* Documentation Tabs */}
          <Tabs defaultValue={initial} className="mt-5">
            <TabsList>
              <TabsTrigger value="lookbook" className="hover:cursor-pointer">
                Lookbook
              </TabsTrigger>
              <TabsTrigger
                value="locationbook"
                className="hover:cursor-pointer"
              >
                Location Book
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lookbook">
              <LookBookDocumentaiton />
            </TabsContent>
            <TabsContent value="locationbook">
              <LocationBookDocumentation />
            </TabsContent>
          </Tabs>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default HowToSheet;
