// Importing dependencies
import { CircleAlert } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

const available_colors: string[] = [
  "#1f77b4", // Blue
  "#ff7f0e", // Orange
  "#2ca02c", // Green
  "#d62728", // Red
  "#9467bd", // Purple
  "#8c564b", // Brown
  "#e377c2", // Pink
  "#7f7f7f", // Gray
  "#bcbd22", // Olive
  "#17becf", // Cyan
  "#003f5c", // Navy
  "#58508d", // Indigo
  "#ff6361", // Coral
  "#ffa600", // Amber
  "#6a2135", // Burgundy
  "#118ab2", // Sky Blue
  "#06d6a0", // Teal
  "#ef476f", // Rose
  "#073b4c", // Deep Blue
  "#118a7e", // Jade
  "#ff006e", // Hot Pink
  "#8338ec", // Vivid Purple
  "#3a0ca3", // Royal Blue
  "#fb5607", // Vibrant Orange
  "#4e148c", // Deep Violet
];

type EventColorPicker = {
  setColor: Dispatch<SetStateAction<string | undefined>>;
};

const EventColorPicker = ({ setColor }: EventColorPicker) => {
  return (
    <>
      <div className="overflow-x-auto whitespace-nowrap touch-pan-x scroll-smooth scrollbar-hidden">
        <div className="flex gap-2 w-max">
          {available_colors.map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 flex-shrink-0 rounded hover:cursor-pointer hover:opacity-50"
              style={{ backgroundColor: color }}
              onClick={() => setColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center text-sm text-gray-500 gap-1">
        <CircleAlert size={20} /> Scroll for more colors
      </div>
    </>
  );
};

export default EventColorPicker;
