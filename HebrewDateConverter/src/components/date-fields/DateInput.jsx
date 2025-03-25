import { YearInput } from "./YearInput";
import { MonthSelect } from "./MonthSelect";
import { DaySelect } from "./DaySelect";
import { CalendarButton } from "../buttons";
import { ErrorMessage } from "../ErrorMessage";
import { useDateFields } from "../../hooks/useDateFields";

export const DateInput = ({ value, onChange, error: externalError }) => {
  // Use custom hook to manage date fields
  const { fields, handlers, error, fullDate } = useDateFields(
    value,
    onChange,
    externalError
  );

  return (
    <div className="mb-8">
      <label className="block text-indigo-800 text-lg font-bold mb-3">
        הזן תאריך לועזי:
      </label>

      <div className="flex flex-col md:flex-row mb-3">
        <div className="flex-1 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse mb-4 md:mb-0">
          {/* Year input component */}
          <YearInput value={fields.year} onChange={handlers.handleYearChange} />

          {/* Month select component */}
          <MonthSelect
            value={fields.month}
            onChange={handlers.handleMonthChange}
          />

          {/* Day select component */}
          <DaySelect
            value={fields.day}
            month={fields.month}
            year={fields.year}
            onChange={handlers.handleDayChange}
          />
        </div>

        {/* Calendar button component */}
        <div className="flex justify-center md:justify-start md:mr-2">
          <CalendarButton
            selectedDate={fullDate}
            onSelectDate={handlers.handleDateSelected}
          />
        </div>
      </div>

      {/* Error message component */}
      <ErrorMessage message={error} />
    </div>
  );
};
