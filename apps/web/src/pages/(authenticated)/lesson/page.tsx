import { SessionBuilder } from "@/pages/(authenticated)/lesson/SessionBuilder.tsx";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { completeSession, getTasks } from "@/services/api/tasks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { AnimatePresence } from "framer-motion";
import { LessonPageLoading } from "./loading";
import { useState, useEffect, useCallback } from "react";
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
  const [enabled, setEnabled] = useState(false); // Управление состоянием запроса
  const [completed, setCompleted] = useState(false); // Состояние завершения урока
  const [startDate, setStartDate] = useState<number | null>(null); // Время начала сессии
  const [stats, setStats] = useState(defaultStats); // Статистика
  const params = useParams();
  const cloudStorage = useCloudStorage();

  // Получаем данные о сессии, выполняем запрос только если enabled === true
  const { data: session, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () =>
      getTasks({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
        topic_id: params.topicId ? Number(params.topicId) : undefined,
        isHard: params["*"] === "hard",
        isWorkOnMistakes: params["*"] === "mistakes",
      }),
    enabled, // Запрос выполняется только если enabled === true
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const complete = useCallback(
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
    [session, startDate]
  );

  const restartSession = useCallback(() => {
    setCompleted(false); // Сбросить состояние завершения
    setStartDate(new Date().getTime()); // Установить новое время начала
    setStats(defaultStats); // Сбросить статистику
    setEnabled(true); // Включить запрос для новой сессии
  }, []);

  useEffect(() => {
    if (!startDate) {
      setStartDate(new Date().getTime());
    }
  }, [startDate]);

  useEffect(() => {
    if (session?.amount && stats.total === 0 && stats.completed === 0 && stats.correct === 0 && stats.index === 1) {
      setStats({ total: session.amount, completed: 0, correct: 0, index: 1 });
    }
  }, [session?.amount, stats]);

  const correctPercentage = useMemo(() => Math.round((stats.correct / stats.total) * 100), [stats]);

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
          onRestart={restartSession} // Передаем функцию перезапуска
        />
      )}
    </AnimatePresence>
  );
}
