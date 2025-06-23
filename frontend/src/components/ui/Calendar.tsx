// src/components/ui/Calendar.tsx
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import '../../index.css';
import type { Matcher } from 'react-day-picker';

interface CalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  disabled?: Matcher | Matcher[];
}

export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  const [month, setMonth] = useState<Date>(selected);

  useEffect(() => {
    setMonth(selected);
  }, [selected]);

  return (
    <DayPicker
      mode="single"
      selected={selected}
      month={month}
      onSelect={(date) => date && onSelect(date)}
      onMonthChange={(newMonth) => setMonth(newMonth)}
      disabled={disabled}
      startMonth={new Date(1995, 5, 20)}
      endMonth={new Date()}
    />
  );
}
