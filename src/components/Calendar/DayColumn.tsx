type DayColumnProps = {
  date: Date;
};

const DayColumn = ({ date }: DayColumnProps) => {
  return (
    <div
      className={`w-1/7 pb-2 flex flex-col items-center justify-start border-r
            ${date.getDay() == 0 && "border-l"} 
            ${date.getDay() == 6 && "border-r"}
                `}
    >
      {/* Date Title */}
      <div className="text-2xl">{date.getDate()}</div>
      <div className="text-gray-500">
        {date.toLocaleDateString("en-US", { weekday: "short" })}
      </div>
    </div>
  );
};

export default DayColumn;
