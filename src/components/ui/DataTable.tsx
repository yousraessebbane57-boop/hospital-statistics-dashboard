import type { ReactNode } from 'react';

/** Column definition for the data table */
export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  /** Optional custom cell renderer */
  render?: (row: T) => ReactNode;
  /** Optional class for the cell (e.g. text-right) */
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  /** Optional empty state message */
  emptyMessage?: string;
  className?: string;
}

/**
 * Reusable data table component with strong typing.
 * Used for Patients Database and any tabular data in the admin dashboard.
 */
export function DataTable<T extends object>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Aucune donnée',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white ${className}`}>
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-4 py-3 font-semibold text-slate-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="transition-colors hover:bg-slate-50"
              >
                {columns.map((col) => {
                  const value = (row as Record<string, unknown>)[String(col.key)];
                  const content = col.render
                    ? col.render(row)
                    : value != null
                      ? String(value)
                      : '—';
                  return (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-slate-800 ${col.className ?? ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
