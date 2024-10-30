import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { ansiToHtml } from "../lib/utils"
import AnsiText from "./AnsiText"
import { AttachmentData } from "@/interfaces"

export interface TestStep {
  name: string
  status: "passed" | "failed" | "skipped" | "pending" | "other"
  extra?: {
    [k: string]: unknown
  }
  [k: string]: unknown
}

export interface TestResult {
  name: string
  status: "passed" | "failed" | "skipped" | "pending" | "other"
  duration: number
  start?: number
  stop?: number
  suite?: string
  message?: string
  trace?: string
  ai?: string
  line?: number
  rawStatus?: string
  tags?: string[]
  type?: string
  filePath?: string
  retries?: number
  flaky?: boolean
  browser?: string
  device?: string
  screenshot?: string
  parameters?: {
    [k: string]: unknown
  }
  steps?: TestStep[]
  extra?: {
    [k: string]: unknown
  }
  [k: string]: unknown
}

interface TestResultsTableProps {
  results: TestResult[]
}

export default function TestResultsTable({ results, attachments={} }: {results: TestResult[], attachments: AttachmentData}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "skipped":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`
  }

  const formatDate = (timestamp?: number) => {
    return timestamp ? new Date(timestamp).toLocaleString() : "N/A"
  }
console.log(attachments)
  return (
    <Accordion type="single" collapsible className="w-full">
      {results.map((result, index) => {
        const suites = Object.keys(attachments);
        const tests = [];
        let screenshot = "";
        let video = "";
        let trace = "";
        suites.forEach(suite => {
          if (attachments[suite][result.name] && result.suite?.includes(suite)) {
            const browserName = result.suite.split(" ")[0].toLowerCase();
            const currentAttachments = attachments[suite][result.name].filter(attachment => attachment.path.toLowerCase().includes(browserName));
            currentAttachments.forEach(attachment => {
              if (attachment.name === "screenshot") {
                screenshot = attachment.path;
              } else if (attachment.name === "video") {
                video = attachment.path;
              } else if (attachment.name === "trace") {
                trace = attachment.path;
              }
            });
          }
        });
        return(
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className={`flex justify-between p-4 ${getStatusColor(result.status)}`}>
            <div className="flex flex-1 justify-between items-center">
              <span className="font-medium">{result.name}</span>
              <span>{result.status}</span>
              <span>{formatDuration(result.duration)}</span>
              <span>{result.suite || "N/A"}</span>
              <div className="flex flex-wrap gap-1">
                {result.tags?.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary">
                    {tag}
                  </Badge>
                )) || "N/A"}
              </div>
              <span>{result.type || "N/A"}</span>
              <span>{result.browser || result.device || "N/A"}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>File Path:</strong> {result.filePath || "N/A"}</p>
                    <p><strong>Start:</strong> {formatDate(result.start)}</p>
                    <p><strong>Stop:</strong> {formatDate(result.stop)}</p>
                    <p><strong>Retries:</strong> {result.retries || 0}</p>
                    <p><strong>Flaky:</strong> {result.flaky ? "Yes" : "No"}</p>
                    <p><strong>Line:</strong> {result.line || "N/A"}</p>
                  </div>
                  <div>
                    {(result.screenshot || screenshot) && (
                      <img
                        src={result.screenshot || screenshot}
                        alt="Test Screenshot"
                        className="max-w-full h-auto"
                      />
                    )}
                  </div>
                  <div>
                    {(result.video || video) && (
                      <video
                        src={video}
                        className="max-w-full h-auto"
                      />
                    )}
                  </div>
                </div>
                {result.message && (
                  <div>
                    <h4 className="font-semibold">Message:</h4>
                    <AnsiText text={result.message} />
                  </div>
                )}
                {result.trace && (
                  <div>
                    <h4 className="font-semibold">Trace:</h4>
                    <AnsiText text={result.trace} />
                  </div>
                )}
                {result.ai && (
                  <div>
                    <h4 className="font-semibold">AI Suggestion:</h4>
                    <p>{result.ai}</p>
                  </div>
                )}
                {result.parameters && (
                  <div>
                    <h4 className="font-semibold">Parameters:</h4>
                    <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(result.parameters, null, 2)}</pre>
                  </div>
                )}
                {result.steps && result.steps.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Steps:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Step</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Extra</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.steps.map((step, stepIndex) => (
                          <TableRow key={stepIndex} className={getStatusColor(step.status)}>
                            <TableCell>{step.name}</TableCell>
                            <TableCell>{step.status}</TableCell>
                            <TableCell>
                              {step.extra && (
                                <pre className="text-xs bg-gray-100 p-1 rounded">{JSON.stringify(step.extra, null, 2)}</pre>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {result.extra && (
                  <div>
                    <h4 className="font-semibold">Extra Information:</h4>
                    <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(result.extra, null, 2)}</pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      )})}
    </Accordion>
  )
}