"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown } from "lucide-react"
import GradeSection from "./GradeSection"
import type { SystemData, GradeData } from "@/lib/data-service"

interface AccordionSectionProps {
  title: string
  description?: string
  system: string
  data: SystemData
}

export default function AccordionSection({ title, description, system, data }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-nmg-primary text-white">
              <span className="font-bold text-lg">{system === "CBC" ? "C" : "8"}</span>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        {Object.entries(data || {}).map(([levelKey, levelData]) => (
          <GradeSection
            key={levelKey}
            title={levelKey}
            data={levelData as GradeData}
            system={system}
            level={levelKey}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
} 