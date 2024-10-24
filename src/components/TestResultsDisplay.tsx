import { Card, CardContent } from "./ui/card";

export interface TestSummary {
  tests: number;
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  other: number;
  suites: number;
  start: number;
  stop: number;
}

interface TestResultsDisplayProps {
  summary: TestSummary;
}

export default function TestResultsDisplay({ summary }: TestResultsDisplayProps) {
  const resultItems = [
    { label: "Passed", value: summary.passed, color: "bg-green-500" },
    { label: "Failed", value: summary.failed, color: "bg-red-500" },
    { label: "Skipped", value: summary.skipped, color: "bg-yellow-500" },
    { label: "Pending", value: summary.pending, color: "bg-blue-500" },
    { label: "Other", value: summary.other, color: "bg-purple-500" },
  ]

  const formatDuration = (start: number, stop: number) => {
    const duration = stop - start
    return `${(duration / 1000).toFixed(2)} seconds`
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Test Results Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {resultItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mb-2`}>
                <span className="text-white text-xl font-bold">{item.value}</span>
              </div>
              <span className="text-sm font-medium text-center">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Total Tests:</span>
            <span>{summary.tests}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Suites:</span>
            <span>{summary.suites}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Start Time:</span>
            <span>{new Date(summary.start * 1000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">End Time:</span>
            <span>{new Date(summary.stop * 1000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between sm:col-span-2">
            <span className="font-medium">Duration:</span>
            <span>{formatDuration(summary.start, summary.stop)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}