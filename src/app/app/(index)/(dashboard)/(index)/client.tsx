"use client";

import { match } from "ts-pattern";
import useApi from "@/data/hooks/use-api";
import Intro from "./intro";
import Dashboard from "./dashboard";

export default function ClientPage() {
  const { data: completions } = useApi.query("public:module-completion:get:all");
  const count = completions?.length ?? 0;

  return match(count)
    .with(0, () => <Intro />)
    .otherwise(() => <Dashboard />);
}
