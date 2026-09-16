'use client';

import StatCard from '@/components/(new)/common/stats-card';
import LearningImprovementCard from './card.learning-improvement';
import QuestionPerformanceCard from './card.question-performance';
import EngagementCard from './card.engagement';
import ClassGlanceCard from './card.class-glance';
import LeaderboardCard from './card.leaderboard';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';

export interface IClientPage {
  id: string;
}

export default function ClientPage({ id }: IClientPage) {
  // session info
  const { data: info } = useApi.query("ses:analytics:get:info", { id });
  // session metrics
  const { data: metrics } = useApi.query("ses:analytics:get:metrics", { id });
  // players list
  // session questions list

  return (
    <div className="p-6 gap-4 max-w-6xl space-y-6">
      {/* Top Header: Back Button + Session Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-h5 text-secondary-text">
          {info?.moduleVersion.module.title}
        </h1>
      </div>

      {/* Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-12 gap-6">
        {match({ metrics })
          .with({ metrics: P.select(P.nonNullable) }, (data) => (
            <>
              <StatCard
                className="col-span-3"
                label="STUDENTS JOINED"
                value={data.attendanceScore}
                comment={`${data.attendanceAverage}% Attendance`}
                range={data.attendanceAverage >= 50 ? "high" : "low"}
              />
              <StatCard
                className="col-span-3"
                label="PRE-ASSESSMENT SCORE"
                value={`${data.preTestAverage}%`}
                comment="Class baseline"
              />
              <StatCard
                className="col-span-3"
                label="POST-ASSESSMENT SCORE"
                value={`${data.postTestAverage}%`}
                comment="Class outcome"
              />
              <StatCard
                className="col-span-3"
                label="AVERAGE IMPROVEMENT"
                value={data.scoreDifference}
                comment="Average score change"
              />
              <LearningImprovementCard {...data} />
              <QuestionPerformanceCard id={id} />
              <EngagementCard id={id} />
              <ClassGlanceCard id={id} />
              <LeaderboardCard id={id} />
            </>
          ))
          .otherwise(() => null)
        }
      </div>
    </div>
  );
};