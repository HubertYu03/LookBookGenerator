// Importing UI components
import DayColumn from "@/components/Calendar/DayColumn";
import EventBody from "@/components/Calendar/EventBody";
import EventCreationModal from "@/components/Calendar/EventCreationModal";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Importing Icons
import { ChevronDownIcon, Plus } from "lucide-react";

import { useEffect, useState } from "react";

const Calendar = () => {
  // Date States
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  // States for creating an event
  const [openEventCreation, setOpenEventCreation] = useState<boolean>(false);

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

  useEffect(() => {
    // Get the current week on page load up
    get_current_week();
  }, []);

  // Update the current week if the selected date is changed
  useEffect(() => {
    get_current_week();
  }, [selectedDate]);

  return (
    <div className="p-4">
      {/* Top row buttons */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
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
            variant="outline"
            onClick={() => {
              setSelectedDate(new Date());
            }}
          >
            Today
          </Button>

          {/* Button to create an event */}
          <Button
            className="hover:cursor-pointer"
            onClick={() => {
              setOpenEventCreation(true);
            }}
          >
            Create Event <Plus />
          </Button>
        </div>
      </div>

      {/* All the days */}

      {/* The header */}
      <div className="flex">
        {currentWeek.map((week_day, index) => (
          <DayColumn date={week_day} key={index} />
        ))}
      </div>

      {/* Event body */}
      <div>
        <EventBody dates={currentWeek} getWeek={get_current_week} />
      </div>

      {/* Modal to create an event */}
      <EventCreationModal
        open={openEventCreation}
        setOpen={setOpenEventCreation}
        getWeek={get_current_week}
      />
    </div>
  );
};

export default Calendar;
