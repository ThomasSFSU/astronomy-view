import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Matcher } from "react-day-picker";

interface CalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  disabled?: Matcher | Matcher[];
}

export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(date) => date && onSelect(date)}
      disabled={disabled}
    />
  );
}
