import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

export default function Page() {
  return (
    <div className="size-full">
      {/* LABORATORY */}
      <div className="relative size-full flex flex-col">
        {/* SIMULATION */}
        <div className="flex-1 bg-muted"></div>
        {/* CHECKPOINTS + CONTROLS CONTAINER */}
        <div className="w-full bg-background border-t">
          {/* TOP */}
          <div className="w-full h-9"></div>
          {/* BOTTOM */}
          <div className="flex w-full h-48 border-t">
            {/* CHECKPOINTS */}
            <div className="flex-1 border-r">
              <ScrollArea>
                <div className="p-4">
                  checkpoint area
                </div>
              </ScrollArea>
            </div>
            {/* CONTROLS */}
            <div className="flex-1">
              <ScrollArea>
                <div className="p-4">
                  control area
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
