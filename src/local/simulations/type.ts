import React from "react";

export type ControlType = "number" | "slider" | "toggle" | "select";

export interface BaseControl {
  id: string;
  label: string;
  description: string;
  type: ControlType;
}

export interface NumberControl extends BaseControl {
  type: "number";
  value: number;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface SliderControl extends BaseControl {
  type: "slider";
  value: number;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ToggleControl extends BaseControl {
  type: "toggle";
  value: boolean;
  defaultValue: boolean;
}

export interface SelectControl extends BaseControl {
  type: "select";
  value: string;
  defaultValue: string;
  options: string[];
}

export type SimulationControl =
  | NumberControl
  | SliderControl
  | ToggleControl
  | SelectControl;

export type SimulationType = "internal" | "external";

export interface InternalSimulationConfig {
  type: "internal";
  slug: string;
  name: string;
  controls: SimulationControl[];
  Model: React.ComponentType<{ slug?: string }>;
}

export interface ExternalSimulationConfig {
  type: "external";
  slug: string;
  name: string;
  embedLink: string;
  controls?: SimulationControl[];
}

export type LocalSimulationConfig =
  | InternalSimulationConfig
  | ExternalSimulationConfig;
