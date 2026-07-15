"use client"

import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo } from "react";
import { LoaderIcon, InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
}
export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const { columns, data, loading } = props;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 0
    }
  });

  const rows = useMemo(() => table.getRowModel().rows, [table, data]);

  return (
    <Table className={cn("table-fixed w-full h-full")}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-background">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="overflow-hidden"
                style={{
                  width: header.column.columnDef.size || '100%'
                }}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          <Loader length={columns.length} />
        ) : rows?.length ? (
          <Content columns={columns} rows={rows} />
        ) : (
          <NoResult length={columns.length} />
        )}
      </TableBody>
    </Table>
  )
};

type IContent<TData> = {
  columns: any[],
  rows: Row<TData>[]
}
function Content<TData>({ columns, rows }: IContent<TData>) {
  return (
    <>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getAllCells().map((cell) => (
            <TableCell
              key={cell.id}
              className="overflow-hidden"
              style={{
                width: cell.column.columnDef.size || '100%'
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
      <TableRow className="hover:bg-background">
        {columns.map((_, index) => (
          <TableCell key={index} className="h-full" />
        ))}
      </TableRow>
    </>
  )
}

type INoResult = {
  length: number
}
function NoResult(props: INoResult) {
  return (
    <TableRow className="hover:bg-background">
      <TableCell colSpan={props.length}>
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <InboxIcon className="size-7 text-muted-foreground opacity-50" />
          <p className="text-sm font-semibold text-muted-foreground">No results.</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

type ILoader = {
  length: number
}
function Loader(props: ILoader) {
  return (
    <TableRow className="hover:bg-background">
      <TableCell colSpan={props.length}>
        <div className="flex items-center justify-center py-8">
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </div>
      </TableCell>
    </TableRow>
  )
}