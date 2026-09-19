"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Path, useController, useFormContext } from "react-hook-form";
import { Switch } from "@base-ui/react/switch";
import { NumberField } from "@base-ui/react/number-field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import useApi from "@/data/hooks/use-api";
import { IFormInput } from "./client";
import ModuleCard from "./module-card";
import React from "react";

export default function ConfigureTab() {
  const { watch } = useFormContext<IFormInput>();
  const moduleId = watch("moduleId");

  const { data: moduleData } = useApi.query("ses:module:get:one", { id: moduleId }, Boolean(moduleId));

  return (
    <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-10 p-6 lg:p-10 overflow-y-auto bg-surface-white">
      {/* LEFT GREEN BOX: Main Settings Card */}
      <div className="w-full max-w-[648px] bg-primary-subtle rounded-3xl p-8 flex flex-col gap-8 shrink-0">
        {/* Header Row */}
        <div className="">
          <h3 className="text-normal text-secondary-text">
            Configure your Session
          </h3>
        </div>

        {/* 1. Configure Mode Section */}
        <Group title={"Configure Mode"}>
          <PaceBlock />
        </Group>

        {/* 2. Lab Room Features Section */}
        <Group title={"Lab Room Features"}>
          <SwitchBlock
            name="config.allowHints"
            label="Hinting"
            desc="Provide helpful cues during difficult tasks"
          />
          <SwitchBlock
            name="config.allowScoreVisibility"
            label="Scores Visibility"
            desc="Scores of all participants will be visible to all learners"
          />
        </Group>

        {/* 3. Session Timing Section */}
        <Group title={"Session Timing"}>
          <NumberBlock
            name="config.maxAdmissions"
            label="Max Participants"
          />
        </Group>

        {/* 4. Additional Rules Section */}
        <Group title={"Additional Rules"}>
          <SwitchBlock
            name="config.allowLateAdmissions"
            label="Allow Late Join"
            desc="Yes, allow students to join late after session starts"
          />
        </Group>
      </div>

      {/* RIGHT GREEN BOX: Selected Module Card Summary */}
      <div className="w-[302px] shrink-0">
        {moduleData ? (<ModuleCard data={moduleData} />) : (
          <div className="w-[302px] h-[263px] rounded-[20px] border-2 border-primary-light bg-primary-subtle flex items-center justify-center text-caption text-tertiary">
            No module selected
          </div>
        )}
      </div>
    </div>
  );
}

type IGroup = {
  title: string;
  children: React.ReactNode;
}
function Group(props: IGroup) {
  const { title, children } = props;

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-normal text-secondary-text">
        {title}
      </p>
      {children}
    </div>
  )
};

type ISwitchBlock = {
  label: string;
  desc: string;
  name: Path<IFormInput>;
}
function SwitchBlock(props: ISwitchBlock) {
  const { label, desc, name } = props;
  const { control } = useFormContext<IFormInput>();
  const { field } = useController({ name, control });

  return (
    <div className="bg-primary-light rounded-2xl p-5 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-normal text-tertiary">
          {label}
        </span>
        <span className="text-caption text-tertiary">
          {desc}
        </span>
      </div>
      <Switch.Root
        checked={Boolean(field.value)}
        onCheckedChange={field.onChange}
        className="flex h-6 w-12 shrink-0 items-center rounded-full p-1 bg-disable cursor-pointer outline-none transition-colors duration-200 data-checked:bg-primary-cta"
      >
        <Switch.Thumb className="size-4 bg-surface-white rounded-full block shadow-xs transition-transform duration-200 data-checked:translate-x-6" />
      </Switch.Root>
    </div>
  );
}

type INumberBlock = {
  label: string;
  name: Path<IFormInput>;
  min?: number;
  max?: number;
  step?: number;
}
function NumberBlock(props: INumberBlock) {
  const { label, name, min = 1, max = 100, step = 5 } = props;
  const { control } = useFormContext<IFormInput>();
  const { field } = useController({ name, control });

  const numValue = typeof field.value === "number" ? field.value : 50;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-normal text-tertiary">
        {label}
      </span>
      <NumberField.Root
        value={numValue}
        onValueChange={(val) => field.onChange(val ?? 0)}
        min={min}
        max={max}
        step={step}
      >
        <NumberField.Group className="flex justify-between w-full max-w-55 bg-primary-light border border-primary-cta/10 rounded-xl focus-within:ring-2 focus-within:ring-primary-cta/20 overflow-hidden">
          <NumberField.Input className="min-w-0 flex-1 h-full bg-transparent text-normal text-tertiary outline-none p-3" />
          <div className="self-stretch w-6 flex-center flex-col">
            <NumberField.Increment className="flex-center size-full text-tertiary hover:text-primary-cta hover:bg-primary-cta/10 disabled:opacity-30 cursor-pointer select-none transition-colors">
              <ChevronUpIcon className="size-4.5" />
            </NumberField.Increment>
            <NumberField.Decrement className="flex-center size-full text-tertiary hover:text-primary-cta hover:bg-primary-cta/10 disabled:opacity-30 cursor-pointer select-none transition-colors">
              <ChevronDownIcon className="size-4.5" />
            </NumberField.Decrement>
          </div>
        </NumberField.Group>
      </NumberField.Root>
    </div>
  );
};

function PaceBlock() {
  const { control } = useFormContext<IFormInput>();
  const { field } = useController({ name: "config.controlMode", control });

  const paces = [
    {
      label: "Self-Paced (Student-paced)",
      desc: "Students explore the content at their own speed.",
      value: "self-paced",
    },
    {
      label: "Control (Teacher-led)",
      desc: "You control the pace and guide students step-by-step.",
      value: "tutor-led",
    },
  ];

  return (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {paces.map((item) => (
        <Radio.Root
          key={item.value}
          value={item.value}
          className="bg-primary-light rounded-2xl p-5 cursor-pointer flex flex-col justify-between gap-3 transition-all text-left outline-none data-checked:ring-2 data-checked:ring-primary-cta data-unchecked:opacity-90 hover:opacity-100"
        >
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full border-2 border-primary-cta bg-surface-slate flex items-center justify-center shrink-0 mt-0.5">
              <Radio.Indicator className="size-2.5 rounded-full bg-primary-cta block" />
            </div>
            <div className="flex flex-col">
              <span className="text-normal text-tertiary leading-snug">
                {item.label}
              </span>
            </div>
          </div>
          <p className="text-caption text-tertiary pl-8">
            {item.desc}
          </p>
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}