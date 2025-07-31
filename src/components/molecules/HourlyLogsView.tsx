import React from "react";
import type { ExcelValue } from "../../types";

// Define the structure of our log entry
interface LogEntry {
  [key: string]: ExcelValue;
}

// Define the structure for logs grouped by date
interface LogsByDate {
  header: string[];
  data: LogEntry[][];
}

// Define the structure for hourly groups
interface HourlyGroup {
  hour: string;
  entries: LogEntry[][];
}

interface Props {
  logs: LogsByDate[];
}

// Function to group log entries by hour
const groupByHour = (entries: LogEntry[][]): HourlyGroup[] => {
  const grouped: { [key: string]: LogEntry[][] } = {};

  entries.forEach((entryGroup) => {
    // Each entryGroup is an array of LogEntry objects
    entryGroup.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      
      // Assuming 'Log Time' is one of the keys in the entry
      const logTime = entry['Log Time'] || entry['logTime'] || entry['time'];
      if (!logTime) return;
      
      const date = new Date(logTime as string);
      if (isNaN(date.getTime())) return;
      
      const hourKey = `${date.getHours().toString().padStart(2, "0")}:00`;

      if (!grouped[hourKey]) {
        grouped[hourKey] = [];
      }
      grouped[hourKey].push(entryGroup);
    });
  });

  // Sort hours in ascending order
  return Object.entries(grouped)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([hour, entries]) => ({
      hour,
      entries,
    }));
};

// Helper function to format cell value for display
const formatCellValue = (value: ExcelValue): React.ReactNode => {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
};

export const HourlyLogsView: React.FC<Props> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <div className="p-4 text-gray-500">No log data available</div>;
  }

  return (
    <div className="p-4 space-y-8">
      {logs.map((logSet, index) => {
        if (!logSet.data || logSet.data.length === 0) {
          return <div key={index} className="text-gray-500">No log entries for this period</div>;
        }

        const hourlyGroups = groupByHour(logSet.data);
        
        return (
          <div key={index} className="space-y-4">
            {hourlyGroups.map((group, idx) => {
              // Flatten the entries array of arrays into a single array of entries
              const flatEntries = group.entries.flat();
              
              return (
                <div key={idx} className="border border-gray-200 rounded-md shadow">
                  <div className="bg-gray-100 px-4 py-2 font-semibold flex justify-between items-center">
                    <span>Hour: {group.hour} - {group.hour.replace(/:00$/, ":59")}</span>
                    <span className="text-sm font-normal text-gray-600">
                      {flatEntries.length} {flatEntries.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {logSet.header.map((col, i) => (
                            <th
                              key={i}
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {flatEntries.map((entry, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {logSet.header.map((header, j) => (
                              <td 
                                key={j} 
                                className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                              >
                                {formatCellValue(entry[header])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
