"use client";

interface FlowExploreExternalProps {
  embedLink?: string;
}

export default function FlowExploreExternal({ embedLink }: FlowExploreExternalProps) {
  if (embedLink) {
    return (
      <div className="flex-1 size-full relative overflow-hidden bg-black">
        <iframe
          src={embedLink}
          title="External Interactive Simulation"
          className="size-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      <img
        src="/(new)/explore-atom.png"
        alt="3D Atom Interactive Simulation"
        className="max-w-xl w-full max-h-140.25 object-contain pointer-events-none drop-shadow-md transition-transform duration-300"
      />
    </div>
  );
}