import { cn } from "~/utils/cn";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  variant?: "default" | "zebra" | "hover";
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ 
  data, 
  columns, 
  variant = "default", 
  className,
  onRowClick 
}: DataTableProps<T>) {
  const tableClasses = cn(
    "data-table",
    variant === "zebra" && "data-table-zebra",
    variant === "hover" && "data-table-hover",
    className
  );

  return (
    <div className={tableClasses}>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className={column.className}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-8 text-center text-[var(--color-text-secondary)]">
          No data available
        </div>
      )}
    </div>
  );
}

interface DataTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableHeader({ children, className }: DataTableHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}

interface DataTableTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableTitle({ children, className }: DataTableTitleProps) {
  return (
    <h2 className={cn("text-heading", className)}>
      {children}
    </h2>
  );
}

interface DataTableActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableActions({ children, className }: DataTableActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
