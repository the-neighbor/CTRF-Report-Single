import { TestData } from '../interfaces';
import TestResultsDisplay, { TestSummary } from '../components/TestResultsDisplay';
import TestResultsTable, { TestResult } from '../components/TestResultsTable';
//component which takes in the props and renders the unit tests page
export default function IntegrationTests({testData}: {testData: TestData}) {
  return (
    <div>
      <h1>Integration Tests</h1>
      <TestResultsDisplay summary={testData.results.summary as TestSummary} />
      <TestResultsTable results={testData.results.tests as TestResult[]}/>
    </div>
  )
}