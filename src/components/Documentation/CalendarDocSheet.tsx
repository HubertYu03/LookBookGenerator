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
import { Smartphone } from "lucide-react";

// Importing Documentation gifs
import {
  CommentingEvent,
  CreateEvent,
  SelectDate,
  EditingEvent,
} from "@/assets/documentation/calendar";

// Importing Custom Components
import GifViewer from "./GifViewer";

// Creating a custom component for content linking
const DocLink = ({
  id,
  label,
  fontSize,
  sublink,
}: {
  id: string;
  label: string;
  fontSize: string;
  sublink: boolean;
}) => {
  function handle_click() {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      className={`text-${fontSize} ${
        sublink && "ml-3"
      } text-gray-500 hover:text-black hover:cursor-pointer`}
      onClick={handle_click}
    >
      {label}
    </div>
  );
};

type CalendarDocSheetProps = {
  open: boolean;
  setOpenChange: Dispatch<SetStateAction<boolean>>;
};

const CalendarDocSheet = ({ open, setOpenChange }: CalendarDocSheetProps) => {
  // Variables for text styling
  const title: string = "text-3xl font-bold";
  const subtitle: string = "text-2xl font-semibold mt-2";
  const text: string = "mt-2 text-gray-600 text-sm";

  return (
    <Sheet open={open} onOpenChange={setOpenChange}>
      <SheetContent className="flex flex-col h-screen duration-150 w-[85vw] max-w-[85vw] sm:w-[750px] sm:max-w-[1500px]">
        <SheetHeader>
          <SheetTitle className="text-3xl">Calendar Documentation</SheetTitle>
          <SheetDescription>
            Documentation containing instructions and visuals on how to use the
            Playet Calendar Tool.
          </SheetDescription>

          <div className="p-2 mt-5 flex flex-row h-[85vh]">
            {/* Documentation Table of Contents */}
            <div className="flex flex-col w-1/4 gap-1">
              {/* Event Creation Section */}
              <DocLink
                id="create"
                label="Creating an Event"
                fontSize="md"
                sublink={false}
              />
              <DocLink
                id="event_modal_overview"
                label="Overview"
                fontSize="sm"
                sublink
              />
              <DocLink
                id="date_selection"
                label="Date Selection"
                fontSize="sm"
                sublink
              />
              <DocLink
                id="all_day_selection"
                label="All Day Selection"
                fontSize="sm"
                sublink
              />

              {/* Event Actions Section */}
              <DocLink
                id="actions"
                label="Event Actions"
                fontSize="md"
                sublink={false}
              />
              <DocLink
                id="pinning_event"
                label="Pinning an Event"
                fontSize="sm"
                sublink
              />
              <DocLink
                id="commenting_event"
                label="Commenting on Events"
                fontSize="sm"
                sublink
              />
              <DocLink
                id="editing_event"
                label="Editing an Event"
                fontSize="sm"
                sublink
              />
              <DocLink
                id="deleting_event"
                label="Deleting an Event"
                fontSize="sm"
                sublink
              />
            </div>

            {/* Documentation Body */}
            <div className="flex-1 p-2 overflow-auto">
              {/* How to Create an event */}
              <div className={title} id="create">
                Creating an Event
              </div>

              <p className={text}>
                To create an event, click on the <b>Create Event</b> button on
                the bottom right of the screen. Clicking on it will prompt a
                popup to open where you can edit the details about your event.
              </p>

              <p className={text}>
                To create an event for a date in the current week, you can hover
                over the day that you want to create the event for and click on
                the <b>plus</b> button that appears. If there are events already
                created for that day, the <b>plus</b> button will appear under
                the <b className="underline">last</b> event of the day.
              </p>

              <GifViewer gif={CreateEvent} />

              <div className={`mt-2 flex flex-row items-start gap-2 ${text}`}>
                <Smartphone size={24} /> For Mobile Devices, simply tap where
                the plus button would be on the desktop to create the event.
              </div>

              {/* Going over the event creation modal */}
              <div className={`mt-2 ${title}`}>Event Creation Popup</div>
              <div className={text}>
                The event creation modal used to create calendar events for all
                to see.
              </div>

              <div className={subtitle} id="event_modal_overview">
                Overview
              </div>
              <div className={text}>
                This popup is how you create an event. It has inputs for you to
                fill in such as the event title, descriptions, and times.
              </div>

              {/* Create Event Date Selection */}
              <div className={subtitle} id="date_selection">
                Date Selection
              </div>
              <div className={text}>
                When selecting a date for your event, you can choose to select a
                single date or a range of dates. In order to select a range of
                dates, toggle the <b>Date Range Selection</b> switch on the
                right of the date selection. To select your range, first click
                on the start day, and then click on the end day. To unselect a
                date, simply click on the dates you want to unselect.
              </div>
              <GifViewer gif={SelectDate} />

              {/* Creat Event All Day Selection */}
              <div className={subtitle} id="all_day_selection">
                All Day Selection
              </div>
              <div className={text}>
                You can create your event to be all day. When selecting the
                times for your event, you can toggle the <b>All Day</b> switch.{" "}
                <b>All Day</b> events will appear at the top of the day of the
                event.
              </div>

              {/* Event Actions */}
              <div className={`mt-2 ${title}`} id="actions">
                Event Actions
              </div>
              <div className={text}>
                Once an event is created you can perform actions on those
                events. Click on an event in the calendar to view the event in
                detail. In this in depth card view, you can see actions on the
                bottom right of the card.
              </div>

              {/* Pinning an Event */}
              <div className={subtitle} id="pinning_event">
                Pinning an Event
              </div>
              <div className={text}>
                You can pin events of choice to be viewed from your <b>Home</b>{" "}
                page. Click on the pin icon at the bottom of the event card, and
                when successfully pinned the icon will turn into an unpin icon.
                Click on the unpin icon to unpin an event from your <b>Home</b>{" "}
                page.
              </div>

              <div className={subtitle} id="commenting_event">
                Commenting on Events
              </div>
              <div className={text}>
                You can add comments to an event but clicking on the{" "}
                <b>Comment</b> icon on the buttom of the event card. Comments
                can be made from everyone, not just the author of the event
                card.
              </div>
              <GifViewer gif={CommentingEvent} />

              <div className={subtitle} id="editing_event">
                Editing an Event
              </div>
              <div className={text}>
                If you are the author of an event you can edit the contents.
                Click on the pencil icon on the bottom of the card and the event
                editing will be activated. Once you make edits you can save it,
                or cancel the editing by clicking cancel.
              </div>
              <GifViewer gif={EditingEvent} />

              <div className={subtitle} id="deleting_event">
                Deleting an Event
              </div>
              <div className={text}>
                You can delete created events by clicking on the trash icon at
                the bottom of the event card. Clicking on the icon will prompt
                you to make sure you absolutely want to delete the event.
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CalendarDocSheet;
