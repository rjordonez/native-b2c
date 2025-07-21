import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: string; // ISO string or empty
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: string; // ISO date string
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Select date and time',
  className,
  disabled = false,
  minDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState(11);
  const [selectedMinute, setSelectedMinute] = useState(59);
  const [selectedAmPm, setSelectedAmPm] = useState<'AM' | 'PM'>('PM');

  // Parse the existing value when modal opens
  React.useEffect(() => {
    if (isOpen && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        const hours = date.getHours();
        setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
        setSelectedMinute(date.getMinutes());
        setSelectedAmPm(hours >= 12 ? 'PM' : 'AM');
      }
    } else if (isOpen && !value) {
      // Set default values when opening without existing value
      setSelectedDate(undefined);
      setSelectedHour(11);
      setSelectedMinute(59);
      setSelectedAmPm('PM');
    }
  }, [isOpen, value]);

  const formatDisplayValue = (dateTimeString: string) => {
    if (!dateTimeString) return placeholder;
    
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return placeholder;
    
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr} at ${timeStr}`;
  };

  const handleSave = () => {
    if (!selectedDate) return;
    
    const date = new Date(selectedDate);
    // Convert 12-hour format to 24-hour format
    let hours24 = selectedHour;
    if (selectedAmPm === 'AM' && selectedHour === 12) {
      hours24 = 0;
    } else if (selectedAmPm === 'PM' && selectedHour !== 12) {
      hours24 = selectedHour + 12;
    }
    
    date.setHours(hours24, selectedMinute, 0, 0);
    
    if (!isNaN(date.getTime())) {
      onChange(date.toISOString());
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const minimumDate = minDate ? new Date(minDate) : new Date();
  minimumDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 w-full">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="flex-1 truncate">
              {formatDisplayValue(value)}
            </span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Date and Time</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* Calendar Section */}
          <div className="border rounded-lg">
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              minDate={minimumDate}
            />
          </div>
          
          {/* Time Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium">Time</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Hour Selector */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-500 mb-1">Hour</label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="w-16 h-10 border rounded-md text-center bg-white"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 1;
                    return (
                      <option key={hour} value={hour}>
                        {hour.toString().padStart(2, '0')}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="text-lg font-bold mt-6">:</div>
              
              {/* Minute Selector */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-500 mb-1">Minute</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
                  className="w-16 h-10 border rounded-md text-center bg-white"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* AM/PM Selector */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-500 mb-1">Period</label>
                <select
                  value={selectedAmPm}
                  onChange={(e) => setSelectedAmPm(e.target.value as 'AM' | 'PM')}
                  className="w-16 h-10 border rounded-md text-center bg-white"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Final Preview */}
          {selectedDate && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600">Final Preview:</div>
              <div className="font-medium">
                {(() => {
                  const previewDate = new Date(selectedDate);
                  // Convert 12-hour format to 24-hour format for preview
                  let hours24 = selectedHour;
                  if (selectedAmPm === 'AM' && selectedHour === 12) {
                    hours24 = 0;
                  } else if (selectedAmPm === 'PM' && selectedHour !== 12) {
                    hours24 = selectedHour + 12;
                  }
                  previewDate.setHours(hours24, selectedMinute, 0, 0);
                  return formatDisplayValue(previewDate.toISOString());
                })()}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!value}
          >
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedDate}
              className="bg-[#272A69] hover:bg-[#272A69]/90"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};