import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header, { TestType } from './components/Header';
import UnitTests from './pages/UnitTests';
import IntegrationTests from './pages/IntegrationTests';
import { TestData } from './interfaces';
// import HomePage from './pages/HomePage';
import BranchPage from './pages/BranchPage';


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

function App() {
  return (
    <div className="App">
      <BranchPage />
    </div>
  );
}

export default App;
