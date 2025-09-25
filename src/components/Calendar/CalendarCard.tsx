// Importing UI Components
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Global types
import type { Calendar } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing Database
import { supabase } from "@/lib/supabaseClient";

// Importing Icons
import { EyeOff } from "lucide-react";

type CalendarCardProps = {
  calendar_id: string;
};

const CalendarCard = ({ calendar_id }: CalendarCardProps) => {
  // Current Calendar
  const [calendar, setCalendar] = useState<Calendar>();

  // Navigation Component
  const navigate = useNavigate();

  async function get_calendar() {
    let { data: calendar, error } = await supabase
      .from("calendar")
      .select("*")
      .eq("calendar_id", calendar_id);

    if (error) {
      console.log(error);
      return;
    }

    if (calendar) setCalendar(calendar[0]);
  }

  useEffect(() => {
    get_calendar();
  }, []);

  return (
    <Card className="w-full flex flex-col justify-between">
      <CardHeader>
        {/* Calendar Title and Private ToolTip */}
        <CardTitle className="flex flex-row items-center justify-between">
          <div>{calendar?.calendar_name}</div>

          {calendar?.private && (
            <Tooltip>
              <TooltipTrigger>
                <EyeOff />
              </TooltipTrigger>
              <TooltipContent>Private</TooltipContent>
            </Tooltip>
          )}
        </CardTitle>

        {calendar?.calendar_desc && (
          <CardDescription>{calendar.calendar_desc}</CardDescription>
        )}
      </CardHeader>

      <CardFooter>
        <Button
          className="hover:cursor-pointer"
          onClick={() => navigate(`/calendar/${calendar?.calendar_id}`)}
        >
          View Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalendarCard;
