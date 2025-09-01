// This is the main body of all the events for the week

// Importing custom UI components
import EventColumn from "./EventColumn";

type EventBodyProps = {
  dates: Date[];
  getWeek: () => void;
};

const EventBody = ({ dates, getWeek }: EventBodyProps) => {
  return (
    <div className="flex flex-row h-[77vh] overflow-y-auto overflow-x-hidden">
      {dates.map((date, index) => (
        <div
          className="w-1/7 flex flex-col items-center justify-start"
          key={index}
        >
          <EventColumn date={date} dates={dates} getWeek={getWeek} />
        </div>
      ))}
    </div>
  );
};

export default EventBody;
