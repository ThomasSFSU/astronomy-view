// src/components/DatePicker.tsx
import { Calendar } from './ui/Calendar';

interface Props {
  date: Date;
  years: number[];
  onChange: (date: Date) => void;
}

export function DatePicker({ date, years, onChange }: Props) {
  const setYear = (year: number) =>
    onChange(new Date(year, date.getMonth(), date.getDate()));
  const setMonth = (month: number) => {
    const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();
    onChange(new Date(date.getFullYear(), month, Math.min(date.getDate(), daysInMonth)));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">
        Pick a Date
      </h3>
      <div className="space-y-4">
        <div className="flex justify-center items-center gap-2">
          <select
            value={date.getFullYear()}
            onChange={e => setYear(+e.target.value)}
            className="bg-slate-700 text-white p-1 rounded"
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={date.getMonth()}
            onChange={e => setMonth(+e.target.value)}
            className="bg-slate-700 text-white p-1 rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <Calendar
            selected={date}
            onSelect={onChange}
            disabled={{
              before: new Date(1995, 0, 1),
              after: new Date(),
            }}
          />
        </div>
      </div>
    </div>
  );
}
