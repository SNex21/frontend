import { SessionBuilder } from "@/pages/(authenticated)/lesson/SessionBuilder.tsx";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { completeSession, getTasks } from "@/services/api/tasks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { AnimatePresence } from "framer-motion";
import { LessonPageLoading } from "./loading";
import React from "react";
import { LessonComplete } from "./LessonComplete";
import { useParams } from "react-router-dom";
import { Guess } from "@/models/Session";

const defaultStats = {
  total: 0,
  completed: 0,
  correct: 0,
  index: 1,
};

export default function LessonPage() {
  const params = useParams();
  const cloudStorage = useCloudStorage();

  const [completed, setCompleted] = React.useState(false);
  const [startDate, setStartDate] = React.useState<number | null>(null);
  const [stats, setStats] = React.useState(defaultStats);

  const { data: session, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () =>
      getTasks({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
        topic: params.topicId ? Number(params.topicId) : undefined,
        isHard: params["*"] === "hard",
        isWorkOnMistakes: params["*"] === "mistakes",
      }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });
  console.log(session.tasks)
  const complete = React.useCallback(
    async ({ guesses }: { guesses: Guess[] }) => {
      if (session && startDate) {
        try {
          await completeSession({
            token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
            id: session.id,
            wastedTime: new Date().getTime() - startDate,
            guesses,
          });
        } catch (e) {
          console.error(e);
        }
      }
      setCompleted(true);
    },
    [session, session?.id, startDate],
  );

  React.useEffect(() => {
    if (!startDate) {
      setStartDate(new Date().getTime());
    }
  }, [startDate]);

  React.useEffect(() => {
    if (session?.amount && stats.total === 0 && stats.completed === 0 && stats.correct === 0 && stats.index === 1) {
      setStats({ total: session.amount, completed: 0, correct: 0, index: 1 });
    }
  }, [session?.amount, stats]);

  const correctPercentage = React.useMemo(() => Math.round((stats.correct / stats.total) * 100), [stats]);

  return (
    <AnimatePresence>
      {isLoading && <LessonPageLoading initial key="loading" />}
      {session && !completed && (
        <SessionBuilder key="session" session={session} stats={stats} setStats={setStats} onComplete={complete} />
      )}
      {completed && <LessonComplete startDate={startDate} correctPercentage={correctPercentage} />}
    </AnimatePresence>
  );
}
