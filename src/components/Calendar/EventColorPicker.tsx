// Importing dependencies
import { type Dispatch, type SetStateAction } from "react";

const available_colors: string[] = [
  "#8ecae6",
  "#219ebc",
  "#023047",
  "#ffb703",
  "#fb8500",
  "#606c38",
  "#283618",
  "#dda15e",
  "#bc6c25",
  "#2b2d42",
  "#d90429",
  "#210124",
  "#750d37",
  "#355070",
  "#6d597a",
  "#b56576",
  "#e56b6f",
  "#E2E8CE",
];

type EventColorPicker = {
  setColor: Dispatch<SetStateAction<string | undefined>>;
};

const EventColorPicker = ({ setColor }: EventColorPicker) => {
  return (
    <div className="flex flex-row gap-2 overflow-auto">
      {available_colors.map((color, index) => (
        <div
          className="w-10 h-5 hover:cursor-pointer hover:opacity-50"
          style={{ backgroundColor: color }}
          key={index}
          onClick={() => {
            setColor(color);
          }}
        />
      ))}
    </div>
  );
};

export default EventColorPicker;
