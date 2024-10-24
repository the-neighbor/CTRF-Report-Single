export interface TestData {
    results: {
      tool: {
        name: string
        version?: string
        extra?: {
          [k: string]: unknown
        }
        [k: string]: unknown
      }
      summary: {
        tests: number
        passed: number
        failed: number
        skipped: number
        pending: number
        other: number
        suites?: number
        start: number
        stop: number
        extra?: {
          [k: string]: unknown
        }
        [k: string]: unknown
      }
      tests: {
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
        steps?: {
          name: string
          status: "passed" | "failed" | "skipped" | "pending" | "other"
          extra?: {
            [k: string]: unknown
          }
          [k: string]: unknown
        }[]
        extra?: {
          [k: string]: unknown
        }
        [k: string]: unknown
      }[]
      environment?: {
        reportName?: string
        appName?: string
        appVersion?: string
        buildName?: string
        buildNumber?: string
        buildUrl?: string
        repositoryName?: string
        repositoryUrl?: string
        commit?: string
        branchName?: string
        osPlatform?: string
        osRelease?: string
        osVersion?: string
        testEnvironment?: string
        extra?: {
          [k: string]: unknown
        }
        [k: string]: unknown
      }
      extra?: {
        [k: string]: unknown
      }
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  