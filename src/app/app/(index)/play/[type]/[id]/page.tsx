import React from 'react'

export default function Page() {
  return (
    <div className="size-full">
      {/* LABORATORY */}
      <div className="relative size-full flex-center">
        {/* SIMULATION */}
        <div className=""></div>
        {/* CHECKPOINTS + CONTROLS CONTAINER */}
        <div className="absolute left-0 bottom-0 z-50 w-full bg-background border-t">
          {/* TOP */}
          <div className="w-full h-9"></div>
          {/* BOTTOM */}
          <div className="flex w-full h-48 border-t">
            {/* CHECKPOINTS */}
            <div className="flex-1 border-r">checkpoints</div>
            {/* CONTROLS */}
            <div className="flex-1">controls</div>
          </div>
        </div>
      </div>
    </div>
  )
}
