'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/(new)/common/logo';

export default function Lobby() {
  return (
    <div className="min-h-screen w-full bg-surface-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-[500px] flex flex-col items-center justify-center text-center">
        {/* OPENLEARNXR Logo */}
        <div className="flex justify-center mb-10">
          <Logo className="w-[187px] h-auto" />
        </div>

        {/* Status Heading */}
        <h1 className="text-h6 text-primary-text-dark mb-8">
          Waiting for host to let you in
        </h1>

        {/* Animated Teal Spinner Ring */}
        <div className="mb-6 flex justify-center">
          <Loader2 className="size-8 text-primary-cta animate-spin stroke-[2.5]" />
        </div>

        {/* Student Waiting Illustration from public folder */}
        <div className="w-full max-w-[340px] relative h-[240px] flex items-center justify-center">
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