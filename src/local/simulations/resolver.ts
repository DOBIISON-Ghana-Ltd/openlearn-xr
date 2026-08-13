import { useStore } from "zustand";
import { simStore } from "@/store/sim/store";
import { ControlValue } from "@/store/sim/type";

/**
 * Fine-grained, type-safe selector for hand-written 3D model components.
 * Subscribes strictly to a primitive value by control ID using O(1) controlsMap.
 */
export function useSimValue<TMap = Record<string, ControlValue>, K extends keyof TMap & string = keyof TMap & string>(
  id: K,
  fallback?: TMap[K]
): TMap[K] {
  return useStore(
    simStore,
    (s) => (s.controlsMap[id]?.value as TMap[K]) ?? (fallback as TMap[K])
  );
}

/**
 * Returns the updateControl action for updating a control by ID.
 */
export function useUpdateSimControl() {
  return useStore(simStore, (s) => s.updateControl);
}

