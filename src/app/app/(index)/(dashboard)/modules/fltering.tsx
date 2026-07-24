"use client";

import { useEffect, useState } from "react";
import { nuqs } from "@/lib/utils/nuqs";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcwIcon, SearchIcon } from "lucide-react";

export default function Filtering() {
  const [state, setState] = nuqs.getStates("sim:modules", { history: "push" });

  const hasActiveFilters =
    state.search !== "" ||
    state.status !== "all" ||
    state.subject !== "all" ||
    state.grade !== "all";

  const handleReset = () => {
    setState({
      search: "",
      status: "all",
      subject: "all",
      grade: "all",
    });
  };

  const handleChange = (key: keyof typeof state) => (val: string) => {
    setState({ [key]: val });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <SearchBlock value={state.search} onChange={handleChange("search")} />
      <StatusBlock value={state.status} onChange={handleChange("status")} />
      <SubjectBlock value={state.subject} onChange={handleChange("subject")} />
      <GradeBlock value={state.grade} onChange={handleChange("grade")} />
      {hasActiveFilters && (
        <Button
          size="icon"
          variant="outline"
          onClick={handleReset}
          title="Clear filters"
        >
          <RotateCcwIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};

type IBlockProps = {
  value: string;
  onChange: (val: string) => void;
}

function SearchBlock({ value, onChange }: IBlockProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue === value) return;
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, value, onChange]);

  return (
    <div className="w-sm">
      <InputGroup>
        <InputGroupInput
          placeholder="Search modules..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <SearchIcon className="size-4 text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function StatusBlock({ value, onChange }: IBlockProps) {
  return (
    <Select value={value} onValueChange={(val) => val && onChange(val as string)}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="available">Available</SelectItem>
        <SelectItem value="coming-soon">Coming Soon</SelectItem>
      </SelectContent>
    </Select>
  );
}

function SubjectBlock({ value, onChange }: IBlockProps) {
  return (
    <Select value={value} onValueChange={(val) => val && onChange(val as string)}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subjects</SelectItem>
        <SelectItem value="physics">Physics</SelectItem>
        <SelectItem value="chemistry">Chemistry</SelectItem>
      </SelectContent>
    </Select>
  );
}

function GradeBlock({ value, onChange }: IBlockProps) {
  return (
    <Select value={value} onValueChange={(val) => val && onChange(val as string)}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Grade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Grades</SelectItem>
        <SelectItem value="year1">Year 1</SelectItem>
        <SelectItem value="year2">Year 2</SelectItem>
        <SelectItem value="year3">Year 3</SelectItem>
      </SelectContent>
    </Select>
  );
}