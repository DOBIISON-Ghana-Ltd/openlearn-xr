import { LocalSimulationConfig } from "../../type";
import Model, { SimpleHarmonicMotionOverlay } from "./model.v1";

export type IValueMap = {
  pendulum_length: number;
  bob_mass: number;
  initial_angle: number;
  gravity_environment:
    | "Earth (9.81 m/s²)"
    | "Moon (1.62 m/s²)"
    | "Mars (3.72 m/s²)"
    | "Jupiter (24.79 m/s²)"
    | "Zero Gravity (0 m/s²)"
    | "Custom Value";
  custom_gravity: number;
  friction_damping: "None (Vacuum)" | "Low (Air)" | "Medium" | "High";
  target_swings: "Continuous (Free Run)" | "5 Swings" | "10 Swings (Standard)" | "20 Swings";
  simulation_speed: "Normal (1.0x)" | "Slow Motion (0.5x)" | "Quarter Speed (0.25x)";
  show_energy_vectors: boolean;
  show_protractor: boolean;
  show_ruler: boolean;
  release_pendulum: boolean;
  reset_setup: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "simple-harmonic-motion",
  name: "Simple Harmonic Motion - Pendulum Lab",
  Model,
  Overlay: SimpleHarmonicMotionOverlay,
  controls: [
    {
      id: "pendulum_length",
      label: "Length (m)",
      description: "Adjust the length of the suspension string (0.10 m to 1.50 m).",
      type: "slider",
      value: 0.70,
      defaultValue: 0.70,
      min: 0.10,
      max: 1.50,
      step: 0.05,
    },
    {
      id: "bob_mass",
      label: "Bob Mass (kg)",
      description: "Adjust the mass of the pendulum bob (0.10 kg to 2.00 kg).",
      type: "slider",
      value: 1.00,
      defaultValue: 1.00,
      min: 0.10,
      max: 2.00,
      step: 0.10,
    },
    {
      id: "initial_angle",
      label: "Release Angle (°)",
      description: "Set the initial displacement angle on the protractor arc.",
      type: "slider",
      value: 25,
      defaultValue: 25,
      min: 5,
      max: 80,
      step: 5,
    },
    {
      id: "gravity_environment",
      label: "Gravity (g)",
      description: "Select a planetary body or choose Custom Value.",
      type: "select",
      options: [
        "Earth (9.81 m/s²)",
        "Moon (1.62 m/s²)",
        "Mars (3.72 m/s²)",
        "Jupiter (24.79 m/s²)",
        "Zero Gravity (0 m/s²)",
        "Custom Value",
      ],
      value: "Earth (9.81 m/s²)",
      defaultValue: "Earth (9.81 m/s²)",
    },
    {
      id: "custom_gravity",
      label: "Custom Gravity (m/s²)",
      description: "Applies when 'Custom Value' is selected above (0 to 25 m/s²).",
      type: "slider",
      value: 9.81,
      defaultValue: 9.81,
      min: 0.0,
      max: 25.0,
      step: 0.1,
    },
    {
      id: "friction_damping",
      label: "Air Resistance / Friction",
      description: "Set the aerodynamic viscous drag level.",
      type: "select",
      options: [
        "None (Vacuum)",
        "Low (Air)",
        "Medium",
        "High",
      ],
      value: "None (Vacuum)",
      defaultValue: "None (Vacuum)",
    },
    {
      id: "target_swings",
      label: "Oscillation Target",
      description: "Choose whether to run continuously or stop after target swings.",
      type: "select",
      options: [
        "Continuous (Free Run)",
        "5 Swings",
        "10 Swings (Standard)",
        "20 Swings",
      ],
      value: "Continuous (Free Run)",
      defaultValue: "Continuous (Free Run)",
    },
    {
      id: "simulation_speed",
      label: "Playback Speed",
      description: "Select real-time or precision slow motion.",
      type: "select",
      options: [
        "Normal (1.0x)",
        "Slow Motion (0.5x)",
        "Quarter Speed (0.25x)",
      ],
      value: "Normal (1.0x)",
      defaultValue: "Normal (1.0x)",
    },
    {
      id: "show_energy_vectors",
      label: "Show Velocity & Accel Vectors",
      description: "Render real-time tangential velocity and centripetal acceleration vector arrows on the bob.",
      type: "toggle",
      value: false,
      defaultValue: false,
    },
    {
      id: "show_protractor",
      label: "Show Protractor Arc",
      description: "Display the degree protractor angle guide at the pivot.",
      type: "toggle",
      value: true,
      defaultValue: true,
    },
    {
      id: "show_ruler",
      label: "Show Meter Rule",
      description: "Display the laboratory meter rule alongside the pendulum.",
      type: "toggle",
      value: true,
      defaultValue: true,
    },
    {
      id: "release_pendulum",
      label: "Start / Pause",
      description: "Start or pause continuous pendulum oscillation.",
      type: "toggle",
      value: false,
      defaultValue: false,
    },
    {
      id: "reset_setup",
      label: "Reset Setup",
      description: "Reset the pendulum position, stopwatch, and oscillation counters.",
      type: "toggle",
      value: false,
      defaultValue: false,
    },
  ],
};
