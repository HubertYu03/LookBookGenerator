// This is the main body of all the events for the week

// Importing custom UI components
import EventColumn from "./EventColumn";

type EventBodyProps = {
  dates: Date[];
};

const EventBody = ({ dates }: EventBodyProps) => {
  return (
    <div className="flex flex-row h-[77vh] overflow-auto">
      {dates.map((date, index) => (
        <div
          className="w-1/7 flex flex-col items-center justify-start"
          key={index}
        >
          <EventColumn date={date} dates={dates} />
        </div>
      ))}
    </div>
  );
};

export default EventBody;
