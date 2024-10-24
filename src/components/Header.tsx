import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

export type TestType = "unit" | "integration"

interface HeaderProps {
  initialTab?: TestType
  onTabChange?: (tab: TestType) => void
}

export default function Header({ initialTab = "unit", onTabChange }: HeaderProps = {}) {
  const [activeTab, setActiveTab] = useState<TestType>(initialTab)

  const handleTabChange = (value: string) => {
    const newTab = value as TestType
    setActiveTab(newTab)
    onTabChange?.(newTab)
  }

  return (
    <header className="w-full bg-background shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Test Dashboard</h1>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="unit" className="px-8">
                Unit Tests
              </TabsTrigger>
              <TabsTrigger value="integration" className="px-8">
                Integration Tests
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  )
}