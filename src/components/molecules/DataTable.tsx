"use client"

import * as React from "react"
import type { ExcelData, ExcelValue, SortConfig } from '../../types';


interface DataTableProps {
  data: ExcelData | null;
}

const ROWS_PER_PAGE = 10;

export function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const sortedData = React.useMemo(() => {
    if (!data || !data.rows || !sortConfig) {
      return data?.rows ?? [];
    }

    const { key, direction } = sortConfig;
    const columnIndex = data.headers.indexOf(key);
    if (columnIndex === -1) return data.rows; // Should not happen if key is valid

    return [...data.rows].sort((a, b) => {
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];

      // Basic comparison, handles numbers and strings reasonably
      if (aValue === null || aValue === undefined) return direction === 'ascending' ? -1 : 1;
      if (bValue === null || bValue === undefined) return direction === 'ascending' ? 1 : -1;

      // Attempt numeric comparison first
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum < bNum) return direction === 'ascending' ? -1 : 1;
          if (aNum > bNum) return direction === 'ascending' ? 1 : -1;
          return 0;
      }

      // Fallback to string comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aStr > bStr) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = data?.rows ? Math.ceil(sortedData.length / ROWS_PER_PAGE) : 0;
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage]);


  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <i className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <i className="ml-2 h-4 w-4 text-accent" />;
    }
    return <i className="ml-2 h-4 w-4 text-accent" />;
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };


  if (!data || !data.headers || sortedData.length === 0) { // Check sortedData length instead of paginatedData
     return (
        <div className="">
           <h1 className="text-xl text-[var(--text)] font-semibold">Data Preview</h1>
            <p>
             {data ? 'No data to display.' : 'Upload an Excel file to see the data.'}
            </p>
         <div>
           <p className="text-muted-foreground text-center py-6">
             {data ? 'The uploaded file appears to be empty or has no data rows.' : 'Please upload a file.'}
           </p>
         </div>
        </div>
      )
  }


  return (
    <div className="">
      <h1 className="text-xl text-[var(--text)] font-semibold">Data Preview</h1>
         <p className="text-md text-[var(--text-muted)]">
            Showing page {currentPage} of {totalPages} ({sortedData.length.toLocaleString()} total rows). Click headers to sort.
         </p>
      <div>
        <div className="overflow-x-auto relative rounded-md border">
            <table>
            <thead className="bg-secondary/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                {data.headers.map((header: string, index: number) => (
                    <th key={index} className="whitespace-nowrap px-3 py-2">
                    <button
                        onClick={() => requestSort(header)}
                        className="group px-1 py-1 h-auto text-left font-semibold text-foreground/80 hover:bg-transparent hover:text-primary transition-colors duration-200 glossy-effect shadow-none" // Removed strong glossy effect
                        aria-label={`Sort by ${header}`}
                    >
                        {header || `Column ${index + 1}`}
                        {getSortIcon(header)}
                    </button>
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {paginatedData.map((row: ExcelValue[], rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-secondary/20">
                  {row.map((cell: ExcelValue, cellIndex: number) => (
                  <td key={cellIndex} className="px-3 py-2 whitespace-nowrap">
                    {cell instanceof Date
                        ? cell.toLocaleDateString()
                        : String(cell ?? '')}
                  </td>
                  ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {totalPages > 1 && (
           <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t">
             <span className="text-sm text-muted-foreground mr-auto">
                Page {currentPage} of {totalPages}
             </span>
             <button
               onClick={handlePreviousPage}
               disabled={currentPage === 1}
               className="hover:bg-accent/10 hover:border-accent/50 transition-colors duration-200 button-glossy"
             >
               Previous
             </button>
             <button
               onClick={handleNextPage}
               disabled={currentPage === totalPages}
                className="hover:bg-accent/10 hover:border-accent/50 transition-colors duration-200 button-glossy"
             >
               Next
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
