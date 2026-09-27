'use client';
import React, { useState } from 'react';
import { FiCalendar, FiFilter, FiX } from 'react-icons/fi';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangeFilterProps {
  onDateChange: (range: DateRange) => void;
  initialPreset?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateChange,
  initialPreset = 'all',
}) => {
  const [activePreset, setActivePreset] = useState<string>(initialPreset);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const formatDateValue = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePresetClick = (preset: string) => {
    setActivePreset(preset);
    const now = new Date();

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
      onDateChange({ startDate: null, endDate: null });
      return;
    }

    if (preset === 'day') {
      const todayStr = formatDateValue(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
      onDateChange({ startDate: todayStr, endDate: todayStr });
      return;
    }

    if (preset === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const startStr = formatDateValue(startOfWeek);
      const endStr = formatDateValue(now);
      setStartDate(startStr);
      setEndDate(endStr);
      onDateChange({ startDate: startStr, endDate: endStr });
      return;
    }

    if (preset === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startStr = formatDateValue(startOfMonth);
      const endStr = formatDateValue(now);
      setStartDate(startStr);
      setEndDate(endStr);
      onDateChange({ startDate: startStr, endDate: endStr });
      return;
    }

    if (preset === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const startStr = formatDateValue(startOfYear);
      const endStr = formatDateValue(now);
      setStartDate(startStr);
      setEndDate(endStr);
      onDateChange({ startDate: startStr, endDate: endStr });
      return;
    }

    if (preset === 'custom') {
      // Keep existing custom inputs or set none if empty
      onDateChange({
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
      });
    }
  };

  const handleStartChange = (val: string) => {
    setStartDate(val);
    setActivePreset('custom');
    onDateChange({
      startDate: val ? val : null,
      endDate: endDate ? endDate : null,
    });
  };

  const handleEndChange = (val: string) => {
    setEndDate(val);
    setActivePreset('custom');
    onDateChange({
      startDate: startDate ? startDate : null,
      endDate: val ? val : null,
    });
  };

  const handleClear = () => {
    setActivePreset('all');
    setStartDate('');
    setEndDate('');
    onDateChange({ startDate: null, endDate: null });
  };

  const presets = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider pr-1">
          <FiFilter className="text-slate-400" />
          <span>Filter</span>
        </div>
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto">
          {presets.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handlePresetClick(p.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activePreset === p.value
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Pickers */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
          <FiCalendar className="text-slate-400" />
          <span className="text-slate-500 font-medium">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartChange(e.target.value)}
            className="bg-transparent text-slate-800 focus:outline-none text-xs cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
          <FiCalendar className="text-slate-400" />
          <span className="text-slate-500 font-medium">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndChange(e.target.value)}
            className="bg-transparent text-slate-800 focus:outline-none text-xs cursor-pointer"
          />
        </div>

        {(startDate || endDate || activePreset !== 'all') && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
            title="Reset to all dates"
          >
            <FiX className="text-xs" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
