// Importing UI components
import DayColumn from "@/components/Calendar/DayColumn";
import EventBody from "@/components/Calendar/EventBody";
import EventCreationModal from "@/components/Calendar/EventCreationModal";
import MonthView from "@/components/CalendarMonth/MonthView";
import CalendarDocSheet from "@/components/Documentation/CalendarDocSheet";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

// Importing global types
import type { User, Event } from "@/types/global";

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

  // States for the month views
  const [monthDates, setMonthDates] = useState<Date[]>([]);
  const [secondMonthDates, setSecondMonthDates] = useState<Date[]>([]);

  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [secondMonthEvents, setSecondMonthEvents] = useState<Event[]>([]);

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [secondMonthDate, setSecondMonthDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
  );

  // States for the current view
  const [view, setView] = useState<string>("Week");
  const isTwoMonthView = view === "TwoMonth";

  // States for creating an event
  const [openEventCreation, setOpenEventCreation] = useState<boolean>(false);

  // States for Documentation
  const [openDocs, setOpenDocs] = useState<boolean>(false);

  // Helper function to get the current dates of the month
  function get_current_month() {
    const year: number = selectedDate.getFullYear();
    const month: number = selectedDate.getMonth();

    // First day of the month
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const firstDayIndex = (firstOfMonth.getDay() + 7) % 7;
    const totalDaysInMonth = lastOfMonth.getDate();

    // Total cells needed: at least 28 (4 weeks), possibly 35 or 42
    const totalCells = Math.ceil((firstDayIndex + totalDaysInMonth) / 7) * 7;

    const startDate = new Date(year, month, 1 - firstDayIndex);
    const dates: Date[] = [];

    for (let i = 0; i < totalCells; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      dates.push(current);
    }

    setMonthDates(dates);
  }

  // Helper function to get the second month for two month view
  function get_current_second_month() {
    const year = secondMonthDate.getFullYear();
    const month = secondMonthDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const firstDayIndex = (firstOfMonth.getDay() + 7) % 7;
    const totalDaysInMonth = lastOfMonth.getDate();

    const totalCells = Math.ceil((firstDayIndex + totalDaysInMonth) / 7) * 7;

    const startDate = new Date(year, month, 1 - firstDayIndex);
    const dates: Date[] = [];

    for (let i = 0; i < totalCells; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      dates.push(current);
    }

    setSecondMonthDates(dates);
  }

  // Helper function to format date
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Helper fcuntion to get all the events from the current month
  async function fetch_month_events() {
    const month = currentMonthDate.getMonth();
    const year = currentMonthDate.getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, year + 1, 0); // 0 = last day of previous month

    const start = formatDateLocal(startDate);
    const end = formatDateLocal(endDate);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", start)
      .lte("event_date", end);

    if (error) {
      console.error("Error fetching month events:", error);
      return;
    }

    setMonthEvents(data || []);
  }

  // Helper function to get the event from the second month
  async function fetch_second_month_events() {
    const year = secondMonthDate.getFullYear();
    const month = secondMonthDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const start = formatDateLocal(startDate);
    const end = formatDateLocal(endDate);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", start)
      .lte("event_date", end);

    if (error) {
      console.error("Error fetching second month events:", error);
      return;
    }

    setSecondMonthEvents(data || []);
  }

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

  // Helper function to get the next month
  function get_next_month() {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);

    setSelectedDate(newDate);
    setCurrentMonthDate(newDate);
  }

  function get_previous_month() {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);

    setSelectedDate(newDate);
    setCurrentMonthDate(newDate);
  }

  // Helper function to get the next two month view
  function get_next_two_months() {
    const newPrimaryDate = new Date(selectedDate);
    newPrimaryDate.setMonth(newPrimaryDate.getMonth() + 1);

    const newSecondDate = new Date(newPrimaryDate);
    newSecondDate.setMonth(newPrimaryDate.getMonth() + 1);

    setSelectedDate(newPrimaryDate);
    setCurrentMonthDate(newPrimaryDate);
    setSecondMonthDate(newSecondDate);
  }

  // Helper function to get the previous two month view
  function get_previous_two_months() {
    const newPrimaryDate = new Date(selectedDate);
    newPrimaryDate.setMonth(newPrimaryDate.getMonth() - 1);

    const newSecondDate = new Date(newPrimaryDate);
    newSecondDate.setMonth(newPrimaryDate.getMonth() + 1);

    setSelectedDate(newPrimaryDate);
    setCurrentMonthDate(newPrimaryDate);
    setSecondMonthDate(newSecondDate);
  }

  // Wrapper functions for getting next and previous time periods (months)
  function get_next() {
    if (view == "Month") get_next_month();
    if (view == "TwoMonth") get_next_two_months();
  }

  function get_previous() {
    if (view == "Month") get_previous_month();
    if (view == "TwoMonth") get_previous_two_months();
  }

  useEffect(() => {
    // Get the current events and dates on page load up
    get_current_week();

    // Change the tab title
    document.title = "Playet Tools | Calendar";
  }, []);

  // Update the current week if the selected date is changed
  useEffect(() => {
    if (view == "Week") get_current_week();

    if (view == "Month") {
      get_current_month();
    }

    if (view == "TwoMonth") {
      get_current_month();
      get_current_second_month();
      fetch_month_events();
      fetch_second_month_events();
    }
  }, [selectedDate, currentMonthDate, secondMonthDate]);

  // Get the month events if the view changes
  useEffect(() => {
    if (view === "Month") {
      get_current_month();
      fetch_month_events();
    }

    if (view === "TwoMonth") {
      get_current_month();
      get_current_second_month();
      fetch_month_events();
      fetch_second_month_events();
    }
  }, [view]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (view == "Week") get_next_week();
      if (view == "Month") get_next_month();
    },
    onSwipedRight: () => {
      if (view == "Week") get_previous_week();
      if (view == "Month") get_previous_month();
    },
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div className="p-4" style={{ touchAction: "pan-y" }} {...handlers}>
      <div className="fixed bottom-8 right-8 z-50">
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
          {/* Documentation Button */}
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => setOpenDocs(true)}
          >
            {!isMobile && "How to Use"}
            <CircleQuestionMark />
          </Button>

          {/* Month Navigation Buttons */}
          {!isMobile && view != "Week" && (
            <>
              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={get_previous}
              >
                <ChevronLeftIcon />
              </Button>

              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={get_next}
              >
                <ChevronRightIcon />
              </Button>
            </>
          )}

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
                    setCurrentMonthDate(date);
                    setSecondMonthDate(
                      new Date(date.getFullYear(), date.getMonth() + 1, 1)
                    );
                    setDatePickerOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Selector that allows user to change the view */}
          <Select value={view} onValueChange={setView}>
            <SelectTrigger>
              <SelectValue placeholder={`${view} View`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Week">Week</SelectItem>
              <SelectItem value="Month">Month</SelectItem>
              {!isMobile && <SelectItem value="TwoMonth">2 Month</SelectItem>}
            </SelectContent>
          </Select>

          {/* Button that sets the day to today */}
          <Button
            className="hover:cursor-pointer"
            onClick={() => {
              const today = new Date();
              setSelectedDate(today);
              setCurrentMonthDate(today);
              setSecondMonthDate(
                new Date(today.getFullYear(), today.getMonth() + 1, 1)
              );
            }}
          >
            Today
          </Button>
        </div>
      </div>

      {/* All the days */}

      {/* Week View */}
      {view == "Week" && (
        <>
          {/* Week View Headers */}
          <div className="flex relative">
            {!isMobile && (
              <>
                {/* Previous week */}
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

          {/* Event Week body */}
          <div>
            <EventBody
              dates={currentWeek}
              getWeek={get_current_week}
              user={user}
            />
          </div>
        </>
      )}

      {/* Month View */}
      {view === "Month" && (
        <MonthView
          monthDates={monthDates}
          currentMonth={currentMonthDate.getMonth()}
          events={monthEvents}
          formatDateLocal={formatDateLocal}
          user={user as User}
          getMonthEvents={fetch_month_events}
          twoMonth={isTwoMonthView}
        />
      )}

      {view == "TwoMonth" && (
        <div className="flex flex-row justify-between">
          <MonthView
            monthDates={monthDates}
            currentMonth={currentMonthDate.getMonth()}
            events={monthEvents}
            formatDateLocal={formatDateLocal}
            user={user as User}
            getMonthEvents={fetch_month_events}
            twoMonth={isTwoMonthView}
          />
          <MonthView
            monthDates={secondMonthDates}
            currentMonth={secondMonthDate.getMonth()}
            events={secondMonthEvents}
            formatDateLocal={formatDateLocal}
            user={user as User}
            getMonthEvents={fetch_second_month_events}
            twoMonth={isTwoMonthView}
          />
        </div>
      )}

      {/* Modal to create an event */}
      <EventCreationModal
        open={openEventCreation}
        setOpen={setOpenEventCreation}
        getWeek={get_current_week}
        getMonthEvents={fetch_month_events}
        getSecondMonthEvents={
          isTwoMonthView ? fetch_second_month_events : undefined
        }
        user={user as User}
      />

      <CalendarDocSheet open={openDocs} setOpenChange={setOpenDocs} />
    </div>
  );
};

export default Calendar;
