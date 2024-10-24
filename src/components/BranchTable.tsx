"use client"

import * as React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

export type WorkflowRun = {
  id: string
  branch: string
  status: "completed" | "in_progress" | "queued" | "cancelled" | "skipped",
  datetime: string
  conclusion: "success" | "failure" | "cancelled" | "skipped" | "timed_out" | "action_required" | "neutral" | "stale"
  [key: string]: string;
}


interface BranchTableProps {
    data?: WorkflowRun[],
  onRowClick?: (branch: string) => void
}

export default function BranchTable({data = [], onRowClick = () => {} }: BranchTableProps) {
  const [sortColumn, setSortColumn] = React.useState<keyof WorkflowRun>("datetime")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc")
  const [filterValue, setFilterValue] = React.useState("")

  const sortedAndFilteredData = React.useMemo(() => {
    return data
      .filter((run) =>
        run.branch.toLowerCase().includes(filterValue.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [sortColumn, sortDirection, filterValue])

  const toggleSort = (column: keyof WorkflowRun) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter branches..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("branch")}
                >
                  Branch
                  {sortColumn === "branch" && (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("datetime")}
                >
                  Date/Time
                  {sortColumn === "datetime" && (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Conclusion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredData.map((run) => (
              <TableRow 
                key={run.id} 
                onClick={() => onRowClick(run.branch)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{run.branch}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        run.status === "success"
                          ? "bg-green-500"
                          : run.status === "failure"
                          ? "bg-red-500"
                          : run.status === "in_progress"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                    {run.status}
                  </div>
                </TableCell>
                <TableCell>{new Date(run.datetime).toLocaleString()}</TableCell>
                <TableCell>{run.conclusion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}