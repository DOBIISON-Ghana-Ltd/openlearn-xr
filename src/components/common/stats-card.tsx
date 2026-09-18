import { cn } from "@/lib/utils/cn";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { match } from "ts-pattern";


type IStatCard = {
  label: string;
  value: string;
  comment: string;
  range?: "low" | "high" | null;
  className?: string;
};
export default function StatCard(props: IStatCard) {
  const { label, value, comment, range = null, className } = props;

  return (
    <div className={cn("bg-primary-subtle rounded-2xl p-6 border border-primary-light flex flex-col justify-between gap-3 shadow-xs text-left", className)}>
      <span className="text-caption font-semibold uppercase tracking-wider text-tertiary">
        {label}
      </span>
      <span className="text-h3 sm:text-h2 font-bold text-secondary-text leading-none">
        {value}
      </span>
      <div className={cn("flex items-center gap-1.5 text-caption font-medium text-tertiary", {
        "text-success": range === "high",
        "text-error": range === "low",
      })}>
        {match(range)
          .with("high", () => <CheckCircle2Icon className="size-4 shrink-0" />)
          .with("low", () => <XCircleIcon className="size-4 shrink-0" />)
          .otherwise(() => null)}
        <span>{comment}</span>
      </div>
    </div>
  );
}