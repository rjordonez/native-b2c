import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  minDate,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Get previous month's last days to fill the calendar
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = prevMonth.getDate();
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  const handleDateClick = (date: Date) => {
    if (minDate && date < minDate) return;
    onSelect(date);
  };
  
  const isDateDisabled = (date: Date) => {
    return minDate && date < minDate;
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };
  
  const isToday = (date: Date) => {
    return isSameDay(date, today);
  };
  
  const isSelected = (date: Date) => {
    return selected && isSameDay(date, selected);
  };
  
  // Build calendar grid
  const calendarDays = [];
  
  // Previous month's days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    calendarDays.push(
      <button
        key={`prev-${prevMonthDays - i}`}
        onClick={() => handleDateClick(date)}
        disabled={isDateDisabled(date)}
        className={cn(
          "w-10 h-10 text-sm rounded-md transition-colors",
          "text-gray-400 hover:bg-gray-100",
          isDateDisabled(date) && "cursor-not-allowed opacity-50"
        )}
      >
        {prevMonthDays - i}
      </button>
    );
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(date)}
        disabled={isDateDisabled(date)}
        className={cn(
          "w-10 h-10 text-sm rounded-md transition-colors",
          "hover:bg-gray-100",
          isSelected(date) && "bg-[#272A69] text-white hover:bg-[#272A69]/90",
          isToday(date) && !isSelected(date) && "bg-blue-100 text-blue-600",
          isDateDisabled(date) && "cursor-not-allowed opacity-50 hover:bg-transparent"
        )}
      >
        {day}
      </button>
    );
  }
  
  // Next month's days to fill the grid
  const totalCells = 42; // 6 rows × 7 days
  const remainingCells = totalCells - calendarDays.length;
  
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push(
      <button
        key={`next-${day}`}
        onClick={() => handleDateClick(date)}
        disabled={isDateDisabled(date)}
        className={cn(
          "w-10 h-10 text-sm rounded-md transition-colors",
          "text-gray-400 hover:bg-gray-100",
          isDateDisabled(date) && "cursor-not-allowed opacity-50"
        )}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className={cn("p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h2>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="w-10 h-8 text-xs font-medium text-gray-600 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
    </div>
  );
};