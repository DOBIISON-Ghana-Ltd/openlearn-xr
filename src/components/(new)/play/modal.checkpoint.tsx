'use client';

import { Dialog } from '@base-ui/react/dialog';
import { LightbulbIcon, InfoIcon } from 'lucide-react';

export type IModalPayload = {
  type: 'hint' | 'explanation';
  text: string;
};

export const checkpointModalHandle = Dialog.createHandle<IModalPayload>();

export default function CheckpointModal() {
  return (
    <Dialog.Root handle={checkpointModalHandle}>
      {({ payload }) => {
        const isHint = payload?.type === 'hint';
        const title = isHint ? 'Hint' : 'Explanation';
        const Icon = isHint ? LightbulbIcon : InfoIcon;

        return (
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 z-50" />
            <Dialog.Popup className="fixed top-1/2 left-1/2 flex w-120 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 bg-surface-white p-6 rounded-2xl border border-surface-slate shadow-xl z-50 transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary-cta">
                  <Icon className="size-5" />
                  <Dialog.Title className="text-h6 font-semibold">{title}</Dialog.Title>
                </div>
                {payload?.text && (
                  <Dialog.Description className="text-normal text-primary-text-dark leading-relaxed">
                    {payload.text}
                  </Dialog.Description>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <Dialog.Close className="px-4 py-2 bg-primary-cta hover:bg-primary-hover text-surface-white text-small font-medium rounded-lg transition-all cursor-pointer">
                  {isHint ? 'Got it' : 'Close'}
                </Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        );
      }}
    </Dialog.Root>
  );
}
