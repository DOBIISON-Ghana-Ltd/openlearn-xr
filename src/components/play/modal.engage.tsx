'use client';

import { Dialog } from '@base-ui/react/dialog';

type IEngageResultModal = {
  open: boolean;
  score: number;
  container?: Dialog.Portal.Props["container"];
};

export default function EngageResultModal(props: IEngageResultModal) {
  const { open, score, container } = props;

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal container={container}>
        <Dialog.Backdrop className="absolute inset-0 min-h-full bg-black/5 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 z-30" />
        <Dialog.Popup className="absolute top-1/2 left-1/2 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center gap-6 bg-surface-white p-8 md:p-12 rounded-3xl border border-surface-slate shadow-xl z-30 transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          {/* Header Title & Subtitle */}
          <div className="flex flex-col items-center gap-2">
            <Dialog.Title className="text-h2 font-bold text-primary-cta leading-tight">
              Good Job!
            </Dialog.Title>
            <Dialog.Description className="text-normal text-secondary-text">
              You will get to learn more moving forward
            </Dialog.Description>
          </div>

          {/* Points Earned Box */}
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-button font-semibold text-primary-text-dark">
              Points Earned
            </span>
            <span className="text-display font-bold text-primary-cta leading-none mt-1">
              {score}
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
