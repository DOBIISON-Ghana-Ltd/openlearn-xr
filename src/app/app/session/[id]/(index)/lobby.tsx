"use client";

export default function Lobby() {
  return (
    <div className="w-full px-5 space-y-7">
      <div className="w-full aspect-square rounded-md border flex-center">
        Realtime blob show case of all participants waiting
      </div>
      <div className="w-full flex-center px-4 py-3 round-md border">
        Share with link, qr code, copy code | start session
      </div>
    </div>
  )
}