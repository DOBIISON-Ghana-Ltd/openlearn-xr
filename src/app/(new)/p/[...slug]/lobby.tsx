'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/(new)/common/logo';

export default function Lobby() {
  return (
    <div className="min-h-dvh w-full bg-surface-white flex-center p-6 overflow-hidden">
      <div className="w-full max-w-lg flex-center flex-col text-center">
        <div className="flex justify-center mb-10">
          <Logo className="w-46 h-auto" />
        </div>
        <h1 className="text-h6 text-primary-text-dark mb-8">
          Waiting for host to let you in
        </h1>
        <div className="mb-6 flex justify-center">
          <Loader2 className="size-8 text-primary-cta animate-spin stroke-[2.5]" />
        </div>
        <div className="w-full max-w-xs relative h-60 flex-center">
          <Image
            src="/(new)/waiting-student.svg"
            alt="Student waiting for host"
            fill
            sizes="340px"
            loading="eager"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}