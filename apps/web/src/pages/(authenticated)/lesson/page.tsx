import { SessionBuilder } from "@/pages/(authenticated)/lesson/SessionBuilder.tsx";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { completeSession, getTasks } from "@/services/api/tasks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { AnimatePresence } from "framer-motion";
import { LessonPageLoading } from "./loading";
import React from "react";
import { LessonComplete } from "./LessonComplete";
import { useParams, useSearchParams } from "react-router-dom";
import { Guess } from "@/models/Session";
import { useEffect } from "react";

declare let Telegram: any; 

const defaultStats = {
  total: 0,
  completed: 0,
  correct: 0,
  index: 1,
};

export default function LessonPage() {
  useEffect(() => {
    if (Telegram && Telegram.WebApp) {
      const tg = Telegram.WebApp;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }

      // Отключаем вертикальные свайпы на этой странице
      tg.disableVerticalSwipes();
      tg.enableClosingConfirmation();
      return () => {
        tg.disableVerticalSwipes();
        tg.enableClosingConfirmation();
      };
    }
  }, []);
  const params = useParams();
  const [searchParams] = useSearchParams(); // Извлекаем параметры из строки запроса
  const cloudStorage = useCloudStorage(); // abuba

  const [completed, setCompleted] = React.useState(false);
  const [startDate, setStartDate] = React.useState<number | null>(null);
  const [stats, setStats] = React.useState(defaultStats);
  const [sessionKey, setSessionKey] = React.useState(Date.now());

  const taskAmount = Number(searchParams.get("amount")) || 10; // Получаем значение amount из параметров

  const { data: session, isLoading, refetch } = useQuery({
    queryKey: ["tasks", sessionKey],
    queryFn: async () =>
      getTasks({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
        topic_id: params.topicId ? Number(params.topicId) : undefined,
        isHard: false,
        isWorkOnMistakes: params["*"] === "mistakes",
        amount: taskAmount, // Передаем amount в запрос
      }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const complete = React.useCallback(
    async ({ guesses }: { guesses: Guess[] }) => {
      if (session && startDate) {
        try {
          await completeSession({
            token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
            id: session.id,
            is_aborted: false,
            wastedTime: new Date().getTime() - startDate,
            guesses,
          });
        } catch (e) {
          console.error(e);
        }
      }
      setCompleted(true);
    },
    [session, startDate],
  );

  const restartSession = React.useCallback(() => {
    setSessionKey(Date.now());
    setCompleted(false);
    setStartDate(new Date().getTime());
    setStats(defaultStats);
  }, [refetch]);

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
        <SessionBuilder
          key="session"
          session={session}
          stats={stats}
          setStats={setStats}
          onComplete={complete}
          startDate={startDate ?? Date.now()}
        />
      )}
      {completed && (
        <LessonComplete
          startDate={startDate ?? Date.now()}
          correctPercentage={correctPercentage}
          onRestart={restartSession}
        />
      )}
    </AnimatePresence>
  );
}
