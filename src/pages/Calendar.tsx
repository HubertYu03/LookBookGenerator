// Importing UI components
import DayColumn from "@/components/Calendar/DayColumn";
import EventBody from "@/components/Calendar/EventBody";
import EventCreationModal from "@/components/Calendar/EventCreationModal";
import CalendarDocSheet from "@/components/Documentation/CalendarDocSheet";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Importing global types
import type { User } from "@/types/global";

// Importing Icons
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleQuestionMark,
  Plus,
} from "lucide-react";

// Importing Dependencies
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

type CalendarProps = {
  user: User | undefined;
  isMobile: boolean;
};

const Calendar = ({ user, isMobile }: CalendarProps) => {
  // Date States
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  // States for creating an event
  const [openEventCreation, setOpenEventCreation] = useState<boolean>(false);

  // States for Documentation
  const [openDocs, setOpenDocs] = useState<boolean>(false);

  // Helper function to get the current week dates
  function get_current_week() {
    // Get the current date and the current day of the week (0 = Sunday, 6 = Saturday)
    const currentDayIndex = selectedDate.getDay();

    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - currentDayIndex); // Set to Sunday

    // Generate all days of the current week as Date objects
    let current_week: Date[] = [];

    Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index); // Increment to the corresponding day of the week
      current_week.push(day);
    });

    setCurrentWeek(current_week);
  }

  // Helper function to get the next week
  function get_next_week() {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() + 7);
    setSelectedDate(nextWeek);
  }

  // Helper function to get the previous week
  function get_previous_week() {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() - 7);
    setSelectedDate(nextWeek);
  }

  useEffect(() => {
    // Get the current week on page load up
    get_current_week();

    // Change the tab title
    document.title = "Playet Tools | Calendar";
  }, []);

  // Update the current week if the selected date is changed
  useEffect(() => {
    get_current_week();
  }, [selectedDate]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwiping: (event) => {
      event.event.preventDefault();
    },
    onSwipedLeft: (event) => {
      event.event.preventDefault(); // Prevent default horizontal scroll
      get_next_week();
    },
    onSwipedRight: (event) => {
      event.event.preventDefault();
      get_previous_week();
    },
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div className="p-4" style={{ touchAction: "pan-y" }} {...handlers}>
      <div className="fixed bottom-8 right-8">
        {/* Button to create an event */}
        <Button
          size="lg"
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenEventCreation(true);
          }}
        >
          Create Event <Plus />
        </Button>
      </div>

      {/* Top row buttons */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => setOpenDocs(true)}
          >
            {!isMobile && "How to Use"}
            <CircleQuestionMark />
          </Button>

          {/* Select the current date */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="font-normal hover:cursor-pointer"
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <CalendarUI
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setDatePickerOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Button that sets the day to today */}
          <Button
            className="hover:cursor-pointer"
            onClick={() => {
              setSelectedDate(new Date());
            }}
          >
            Today
          </Button>
        </div>
      </div>

      {/* All the days */}

      {/* The header */}
      <div className="flex relative">
        {/* Week Navigation Button !DO NOT SHOW ON MOBILE! */}

        {/* Previous week */}
        {!isMobile && (
          <>
            <Button
              className="absolute top-3.5 -left-2 hover:cursor-pointer"
              variant="outline"
              onClick={get_previous_week}
            >
              <ChevronLeftIcon />
            </Button>

            {/* Next Week */}
            <Button
              className="absolute top-3.5 -right-2 hover:cursor-pointer"
              variant="outline"
              onClick={get_next_week}
            >
              <ChevronRightIcon />
            </Button>
          </>
        )}

        {/* Week Day Headers */}
        {currentWeek.map((week_day, index) => (
          <DayColumn date={week_day} key={index} />
        ))}
      </div>

      {/* Event body */}
      <div>
        <EventBody dates={currentWeek} getWeek={get_current_week} user={user} />
      </div>

      {/* Modal to create an event */}
      <EventCreationModal
        open={openEventCreation}
        setOpen={setOpenEventCreation}
        getWeek={get_current_week}
      />

      <CalendarDocSheet open={openDocs} setOpenChange={setOpenDocs} />
    </div>
  );
};

export default Calendar;
