import React, { useEffect, useState } from 'react';
import Header, { TestType } from '../components/Header';
import UnitTests from './UnitTests';
import IntegrationTests from './IntegrationTests';
import { TestData } from '../interfaces';


const emptyTestData: TestData = {
  results: {
    tool: {
      name: '',
      version: undefined,
      extra: undefined
    },
    summary: {
      tests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      pending: 0,
      other: 0,
      suites: undefined,
      start: 0,
      stop: 0,
      extra: undefined
    },
    tests: [],
    environment: undefined,
    extra: undefined
  }
}

const BranchPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('unit');
  const [unitTestData, setUnitTestData] = useState<TestData>(emptyTestData);
  const [integrationTestData, setIntegrationTestData] = useState<TestData>(emptyTestData);
  //read in the json file and set the state
  useEffect(() => {
    fetch(`./test-results/unitTestData.json`)
      .then(response => response.json())
      .then(data => setUnitTestData(data))
    fetch(`./test-results/integrationTestData.json`)
      .then(response => response.json())
      .then(data => setIntegrationTestData(data))
   }, [selectedTab])

  return (
    <div className="Branch">
      <Header initialTab={selectedTab as TestType} onTabChange={setSelectedTab}  />
      {selectedTab === 'unit' && <UnitTests testData={unitTestData} />}
      {selectedTab === 'integration' && <IntegrationTests testData={integrationTestData}/>}
    </div>
  );
}

export default BranchPage;