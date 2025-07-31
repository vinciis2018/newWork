import type { ExcelStats } from '../../types'; // Assuming types are defined

interface DataStatsProps {
  stats: ExcelStats | null;
}

export function DataStats({ stats }: DataStatsProps) {
  if (!stats) {
    return (
        <div className="">
          <h1 className="text-xl text-[var(--text)] font-semibold">Summary Statistics</h1>
          <p className="text-md text-[var(--text-muted)]">Upload a file to view statistics.</p>
          <div>
              <p className="text-muted-foreground text-center py-4">No statistics available.</p>
          </div>
        </div>
    );
  }

  const { rowCount, columnCount, columnNames, firstRow, lastRow } = stats;

  return (
    <div className="">
      <h1 className="text-xl text-[var(--text)]">Summary Statistics</h1>
      <div className="space-y-6">
         <div className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold text-foreground/80">Rows:</span> {rowCount.toLocaleString()}</p>
            <p><span className="font-semibold text-foreground/80">Columns:</span> {columnCount.toLocaleString()}</p>
         </div>
        <div>
          <h4 className="font-semibold mb-2 text-foreground/90">Column Names:</h4>
          <div className="flex flex-wrap gap-2">
            {columnNames.map((name, index) => (
              <div key={index} className="font-normal glossy-effect">
                {name || `Column ${index + 1}`}
              </div>
            ))}
          </div>
        </div>

        {firstRow && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground/90">First Row Preview:</h4>
            <div className="overflow-x-auto rounded-md border bg-secondary/30 p-2 glossy-effect">
              <table className="">
                <thead>
                  <tr className="border-none">
                    {columnNames.map((name, index) => (
                      <th key={index} className="px-2 py-1 h-auto text-secondary-foreground/80">
                        {name || `Column ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-none">
                    {columnNames.map((_, index) => (
                      <td key={index} className="px-2 py-1">
                        {String(firstRow[index] ?? '')}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {lastRow && (
           <div>
            <h4 className="font-semibold mb-2 text-foreground/90">Last Row Preview:</h4>
             <div className="overflow-x-auto rounded-md border bg-secondary/30 p-2 glossy-effect">
             <table className="text-xs">
               <thead>
                 <tr className="border-none">
                   {columnNames.map((name, index) => (
                      <th key={index} className="px-2 py-1 h-auto text-secondary-foreground/80">
                        {name || `Column ${index + 1}`}
                      </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 <tr className="border-none">
                   {columnNames.map((_, index) => (
                     <td key={index} className="px-2 py-1">
                       {String(lastRow[index] ?? '')}
                     </td>
                   ))}
                 </tr>
               </tbody>
              </table>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
