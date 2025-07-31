import React, { useState, useMemo, useEffect } from "react";
import type { Sheet, ExcelValue } from "../../types";

// Define the structure for logs grouped by date
interface LogsByDate {
  header: string[];
  data: ExcelValue[][];
  date: Date;
  sheetName: string;
}

// Type for the hour-grouped logs
interface HourlyGroupedLogs {
  [hour: string]: ExcelValue[][];
}

interface Props {
  excelData: Sheet[];
}

export const LogsTabsView: React.FC<Props> = ({ excelData }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHour, setActiveHour] = useState<string | null>(null);

  // Transform excelData into the format needed for the tabs
  const logsByDate = useMemo<LogsByDate[]>(() => {
    if (!excelData?.length) return [];
    
    return excelData.map(sheet => {
      // Convert sheet name (YYYY-MM-DD) to Date object
      const date = new Date(sheet.sheetName);
      return {
        header: sheet.headers,
        data: sheet.rows,
        date,
        sheetName: sheet.sheetName
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date
  }, [excelData]);

  // Group logs by hour for the active day
  const hourlyGroupedLogs = useMemo<HourlyGroupedLogs | null>(() => {
    if (!logsByDate.length || !logsByDate[activeDayIndex]?.data?.length) return null;

    const logs = logsByDate[activeDayIndex];
    const timeIndex = logs.header.indexOf('Log Time');
    
    if (timeIndex === -1) return null;

    const grouped: HourlyGroupedLogs = {};

    logs.data.forEach((row) => {
      if (!row[timeIndex]) return;
      
      const logTime = new Date(row[timeIndex] as string);
      if (isNaN(logTime.getTime())) return;
      
      const hour = logTime.getHours();
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      
      if (!grouped[hourKey]) {
        grouped[hourKey] = [];
      }
      
      grouped[hourKey].push(row);
    });

    return grouped;
  }, [logsByDate, activeDayIndex]);

  // Set the first hour as active when the active day changes
  useEffect(() => {
    if (hourlyGroupedLogs) {
      const hours = Object.keys(hourlyGroupedLogs);
      if (hours.length > 0 && !activeHour) {
        setActiveHour(hours[0]);
      } else if (hours.length > 0 && activeHour && !hours.includes(activeHour)) {
        setActiveHour(hours[0]);
      }
    }
  }, [hourlyGroupedLogs, activeHour]);

  if (!logsByDate.length) {
    return <div className="p-4 text-gray-500">No log data available</div>;
  }

  const activeDay = logsByDate[activeDayIndex];
  const hours = hourlyGroupedLogs ? Object.keys(hourlyGroupedLogs).sort() : [];
  const activeLogs = activeHour && hourlyGroupedLogs ? hourlyGroupedLogs[activeHour] : [];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Date Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {logsByDate.map((day, index) => (
            <button
              key={day.sheetName}
              onClick={() => {
                setActiveDayIndex(index);
                setActiveHour(null); // Reset active hour when changing days
              }}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                index === activeDayIndex
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              <span className="ml-2 bg-gray-100 text-xs px-2 py-0.5 rounded-full">
                {day.data.length} logs
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Hour Tabs */}
      {hours.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex -mb-px overflow-x-auto">
            {hours.map((hour) => {
              const hourNum = parseInt(hour.split(':')[0]);
              const ampm = hourNum >= 12 ? 'PM' : 'AM';
              const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
              const logCount = hourlyGroupedLogs?.[hour]?.length || 0;
              
              return (
                <button
                  key={hour}
                  onClick={() => setActiveHour(hour)}
                  className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                    hour === activeHour
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {displayHour} {ampm}
                  <span className="ml-1 text-xs text-gray-500">({logCount})</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Logs Table */}
      <div className="overflow-x-auto">
        {activeLogs && activeLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeDay.header.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeLogs.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No logs available for the selected time period</p>
            {!hours.length && activeDay.data.length > 0 && (
              <p className="text-sm mt-2 text-gray-400">
                Could not parse time data. Showing all logs for this day.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
