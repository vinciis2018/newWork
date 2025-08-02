import React, { useState, useMemo, useEffect } from "react";
import type { Sheet as ParentSheet, ExcelValue } from "../../types";

// Define the structure for logs
interface LogEntry {
  [key: string]: string;
  'S.N.': string;
  'Log Time': string;
  'Media': string;
  'Brand Name': string;
  'Screen Status': string;
}

// Normalize field names to handle different naming conventions
const normalizeFieldName = (name: string): string => {
  const fieldMap: Record<string, string> = {
    'log stamp': 'Log Time',
    'log time': 'Log Time',
    'logtime': 'Log Time',
    'log date': 'Log Time',
    'media': 'Media',
    'brand': 'Brand Name',
    'brand name': 'Brand Name',
    'screen status': 'Screen Status',
    'screenstatus': 'Screen Status',
    's.n.': 'S.N.',
    'sn': 'S.N.',
    'id': 'S.N.'
  };

  const lowerName = name.toLowerCase().trim();
  return fieldMap[lowerName] || name;
};

// Convert ExcelValue[] to LogEntry
type LogRow = ExcelValue[] | Record<string, unknown>;

const toLogEntry = (headers: string[], row: LogRow): LogEntry => {
  const entry: Record<string, string> = {};

  // Handle array rows
  if (Array.isArray(row)) {
    headers.forEach((header, index) => {
      const value = row[index];
      entry[header] = value?.toString() || '';
    });
  } 
  // Handle object rows
  else if (row && typeof row === 'object') {
    Object.entries(row).forEach(([key, value]) => {
      const normalizedKey = normalizeFieldName(key);
      entry[normalizedKey] = value?.toString() || '';
    });
  }

  // Parse and normalize dates
  const parseDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // Try parsing with Date object
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      // Format as YYYY-MM-DD HH:mm:ss
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    
    // Try common date formats
    const formats = [
      // YYYY-MM-DD HH:MM:SS
      /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{2}):(\d{2})$/,
      // MM/DD/YYYY, HH:MM:SS AM/PM
      /^(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i,
      // DD-MM-YYYY HH:MM:SS
      /^(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/,
    ];
    
    for (const regex of formats) {
      const match = dateStr.match(regex);
      if (match) {
        let year, month, day, hours, minutes, seconds;
        
        if (match[3].length === 4) {
          // YYYY-MM-DD or MM/DD/YYYY format
          year = parseInt(match[3], 10);
          month = parseInt(match[1], 10) - 1;
          day = parseInt(match[2], 10);
        } else {
          // DD-MM-YYYY format
          year = parseInt(match[3], 10);
          month = parseInt(match[2], 10) - 1;
          day = parseInt(match[1], 10);
        }
        
        // Handle time
        if (match[4]) {
          hours = parseInt(match[4], 10);
          minutes = parseInt(match[5], 10);
          seconds = match[6] ? parseInt(match[6], 10) : 0;
          
          // Handle 12-hour format
          if (match[7] && match[7].toUpperCase() === 'PM' && hours < 12) {
            hours += 12;
          } else if (match[7] && match[7].toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
          }
        }
        
        const parsedDate = new Date(year, month, day, hours || 0, minutes || 0, seconds || 0);
        if (!isNaN(parsedDate.getTime())) {
          const pad = (n: number) => n.toString().padStart(2, '0');
          return `${parsedDate.getFullYear()}-${pad(parsedDate.getMonth() + 1)}-${pad(parsedDate.getDate())} ${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}:${pad(parsedDate.getSeconds())}`;
        }
      }
    }
    
    return dateStr; // Return original if parsing fails
  };

  // Normalize all entry keys first
  const normalizedEntry: Record<string, string> = {};
  Object.entries(entry).forEach(([key, value]) => {
    const normalizedKey = normalizeFieldName(key);
    normalizedEntry[normalizedKey] = value;
  });

  // Ensure all required fields exist with proper types
  const logEntry: LogEntry = {
    'S.N.': normalizedEntry['S.N.'] || normalizedEntry['id'] || '',
    'Log Time': parseDate(normalizedEntry['Log Time'] || normalizedEntry['Log Date'] || ''),
    'Media': normalizedEntry['Media'] || '',
    'Brand Name': normalizedEntry['Brand Name'] || '',
    'Screen Status': (normalizedEntry['Screen Status'] || 'unknown').toLowerCase(),
    ...normalizedEntry
  };
  
  console.log('Processed log entry:', logEntry);
  
  return logEntry;
};

interface Props {
  excelData: ParentSheet[];
}

interface LogsByDate {
  sheetName: string;
  date: Date;
  logs: LogEntry[];
  headers: string[];
}

// Type for the hour-grouped logs
interface HourlyGroupedLogs {
  [hour: string]: LogEntry[];
}

export const LogsTabsView: React.FC<Props> = ({ excelData }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHour, setActiveHour] = useState<string | null>(null);

  // Transform excelData into the format needed for the tabs
  const logsByDate = useMemo<LogsByDate[]>(() => {
    if (!Array.isArray(excelData) || excelData.length === 0) {
      console.log('No excelData or empty array provided');
      return [];
    }
    
    return excelData
      .filter(sheet => {
        const isValid = sheet && 
                        sheet.sheetName && 
                        Array.isArray(sheet.rows) && 
                        Array.isArray(sheet.headers);
        if (!isValid) {
          console.warn('Invalid sheet data:', sheet);
        }
        return isValid;
      })
      .map(sheet => {
        try {
          // Convert sheet name (YYYY-MM-DD) to Date object
          const date = new Date(sheet.sheetName);
          
          // Process rows - they might be arrays or objects
          const logs = (sheet.rows || []).map(row => {
            // If row is already an object with the correct structure, use it directly
            if (row && typeof row === 'object' && !Array.isArray(row)) {
              return row as unknown as LogEntry;
            }
            // If row is an array, convert it using toLogEntry
            if (Array.isArray(row)) {
              return toLogEntry(sheet.headers, row);
            }
            // Skip invalid rows
            console.warn('Skipping invalid row:', row);
            return null;
          }).filter((log): log is LogEntry => log !== null);
          
          // Filter out 'Device Time' from headers and create a new array
          const filteredHeaders = (sheet.headers || []).filter(header => 
            header.toLowerCase() !== 'device time' && header.toLowerCase() !== 'devicetime'
          );

          return {
            sheetName: sheet.sheetName,
            date,
            logs,
            headers: filteredHeaders
          };
        } catch (error) {
          console.error('Error processing sheet:', sheet.sheetName, error);
          return null;
        }
      })
      .filter((sheet): sheet is LogsByDate => sheet !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date
  }, [excelData]);

  // Group logs by hour for the active day
  const hourlyGroupedLogs = useMemo<HourlyGroupedLogs | null>(() => {
    if (!logsByDate.length || !logsByDate[activeDayIndex]?.logs?.length) return null;

    const logs = logsByDate[activeDayIndex];
    const grouped: HourlyGroupedLogs = {};

    logs.logs.forEach((log) => {
      if (!log['Log Time']) return;
      
      const logTime = new Date(log['Log Time']);
      if (isNaN(logTime.getTime())) return;
      
      const hour = logTime.getHours();
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      
      if (!grouped[hourKey]) {
        grouped[hourKey] = [];
      }
      
      grouped[hourKey].push(log);
    });

    return grouped;
  }, [logsByDate, activeDayIndex]);

  // Set the first hour as active when the component mounts or when the active day changes
  useEffect(() => {
    if (hourlyGroupedLogs) {
      // Get hours and sort them in ascending order
      const hours = Object.keys(hourlyGroupedLogs).sort((a, b) => {
        const timeA = parseInt(a.split(':')[0]);
        const timeB = parseInt(b.split(':')[0]);
        return timeA - timeB;
      });
      
      console.log('Sorted hours:', hours);
      
      // Always set the first hour as active when the hourly logs change
      if (hours.length > 0) {
        setActiveHour(hours[0]);
      }
    }
  }, [hourlyGroupedLogs]);

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
                {day.logs.length} logs
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
                  {activeDay.headers.map((header, index) => (
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
                {activeLogs.map((log, rowIndex) => {
                  // Create a new log object without the 'Device Time' property
                  const { 'Device Time': _, ...filteredLog } = log; // eslint-disable-line @typescript-eslint/no-unused-vars
                  return (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {activeDay.headers.map((header, cellIndex) => {
                        // Skip rendering if header is 'Device Time' (should be filtered out already)
                        if (header.toLowerCase() === 'device time' || header.toLowerCase() === 'devicetime') {
                          return null;
                        }
                        return (
                          <td
                            key={`${rowIndex}-${cellIndex}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {filteredLog[header] || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No logs available for the selected time period</p>
            {!hours?.length && activeDay?.logs?.length > 0 && (
              <div>
                <p className="text-sm mt-2 text-gray-400">
                  Could not parse time data. Showing all logs for this day.
                </p>
                <button 
                  onClick={() => setActiveHour(null)}
                  className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Show All Logs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
