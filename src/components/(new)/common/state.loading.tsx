import { Loader2Icon } from 'lucide-react';

export default function StateLoading() {
  return (
    <div className="relative flex-1 flex-center flex-col size-full min-h-0 py-16">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
}
