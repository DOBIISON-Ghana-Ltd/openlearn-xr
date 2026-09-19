import { Infer } from "@/data/types.base";
import { match } from "ts-pattern";

export type ILearningImprovementCard = Omit<
  Infer["SesAnalyticsGetMetrics"]["res"],
  "attendanceScore" | "attendanceAverage"
>;

export default function LearningImprovementCard(props: ILearningImprovementCard) {
  const { preTestAverage, postTestAverage, rawScoreDifference } = props;

  return (
    <div className="col-span-12 lg:col-span-6 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-xs">
      {/* Header */}
      <div>
        <h2 className="text-h6 sm:text-h5 font-bold text-secondary-text">
          Learning Improvement
        </h2>
        <p className="text-small text-tertiary mt-0.5">
          Compare class performance before and after the session.
        </p>
      </div>

      {/* Comparison Visual */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 my-2">
        {/* Pre-Assessment (Baseline) */}
        <div className="flex flex-col items-start gap-1">
          <div className="text-small font-medium text-tertiary leading-tight">
            <div>Pre-Assessment</div>
            <div>(Baseline)</div>
          </div>
          <span className="text-h2 font-bold text-secondary-text leading-none mt-2">
            {preTestAverage}%
          </span>
          <div className="w-20 sm:w-28 h-1.5 rounded-full bg-primary-cta/20 overflow-hidden mt-1">
            <div
              className="h-full bg-primary-cta rounded-full"
              style={{ width: `${Math.min(Math.max(preTestAverage, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Center Circular Score Badge */}
        <div className="size-24 sm:size-28 rounded-full bg-primary-light flex-center gap-1 shadow-xs shrink-0 mx-2">
          <span className="text-h4 font-bold text-primary-cta">
            {rawScoreDifference > 0 ? `+${rawScoreDifference}` : rawScoreDifference}
          </span>
          <span className="text-caption font-semibold text-primary-cta">
            pts
          </span>
        </div>

        {/* Post-Assessment (Outcome) */}
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-small font-medium text-tertiary leading-tight">
            <div>Post-Assessment</div>
            <div>(Outcome)</div>
          </div>
          <span className="text-h2 font-bold text-secondary-text leading-none mt-2">
            {postTestAverage}%
          </span>
          <div className="w-20 sm:w-28 h-1.5 rounded-full bg-primary-cta/20 overflow-hidden mt-1">
            <div
              className="h-full bg-primary-cta rounded-full ml-auto"
              style={{ width: `${Math.min(Math.max(postTestAverage, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Subtitle / Summary */}
      <div className="flex flex-col gap-0.5">
        <span className="text-small font-semibold text-primary-cta">
          Average score change
        </span>
        <p className="text-small text-tertiary">
          {match(rawScoreDifference)
            .when((v) => v > 0, () => "Students demonstrated strong improvement after completing the session.")
            .when((v) => v < 0, () => "Students showed lower performance in post-assessment.")
            .otherwise(() => "Students maintained consistent performance across assessments.")}
        </p>
      </div>
    </div>
  );
}
