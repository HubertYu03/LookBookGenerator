// Importing UI Components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Importing Custom Components
import CalendarCard from "@/components/Calendar/CalendarCard";
import CalendarCreationModal from "@/components/Calendar/CalendarCreationModal";

// Importing Icons
import { Plus } from "lucide-react";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing global types
import type { User } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";

type AllCalendarsProps = {
  user: User;
  isMobile: boolean;
};

const AllCalendars = ({ user, isMobile }: AllCalendarsProps) => {
  // Calendar list state
  const [calenders, setCalenders] = useState<string[]>([]);

  // State for opening creation modal
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  async function get_calendars() {
    const { data, error } = await supabase
      .from("users")
      .select("calendar_ids")
      .eq("user_id", user.user_id)
      .single();

    if (error) {
      console.error("Error fetching updated calendars:", error);
      return;
    }

    setCalenders(data.calendar_ids);
  }

  useEffect(() => {
    toast.dismiss();

    get_calendars();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-row flex-wrap justify-between items-center">
        <div className="text-3xl sm:text-5xl font-semibold">My Calendars</div>

        <Button
          size="lg"
          className="hover:cursor-pointer"
          onClick={() => setOpenCreate(true)}
        >
          {!isMobile && "Create Calendar"} <Plus />
        </Button>
      </div>

      {/* Show all calendars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {calenders.map((calendar_id) => (
          <CalendarCard
            calendar_id={calendar_id}
            key={calendar_id}
            getCalendars={get_calendars}
          />
        ))}
      </div>

      {calenders.length == 0 && (
        <div className="flex flex-col justify-center items-center h-52 italic text-gray-500 text-xl">
          No calendars found! Create one to get started!
        </div>
      )}

      <CalendarCreationModal
        open={openCreate}
        setOpen={setOpenCreate}
        authorId={user.user_id}
        setCalendar={setCalenders}
        calendars={calenders}
      />
    </div>
  );
};

export default AllCalendars;
