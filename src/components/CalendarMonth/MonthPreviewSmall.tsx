import type { Event } from "@/types/global";

type MonthPreviewSmallProps = {
  event: Event;
  index: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
  twoMonth: boolean;
};

const MonthPreviewSmall = ({
  event,
  index,
  setOpen,
  setEvent,
  twoMonth,
}: MonthPreviewSmallProps) => {
  if (index < 2) {
    return (
      <div
        className="flex text-[0.7rem] text-white p-1 rounded-sm hover:cursor-pointer"
        style={{
          backgroundColor: event.event_color,
        }}
        onClick={() => {
          setOpen(true);
          setEvent(event);
        }}
      >
        {twoMonth
          ? event.event_title.length > 3
            ? event.event_title.slice(0, 3) + "..."
            : event.event_title
          : event.event_title.length > 10
          ? event.event_title.slice(0, 10) + "..."
          : event.event_title}
      </div>
    );
  }
};

export default MonthPreviewSmall;
