import { SessionBuilder } from "@/pages/(authenticated)/lesson/SessionBuilder.tsx";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { completeSession, getTasks } from "@/services/api/tasks";
import { ACCESS_TOKEN_NAME, IS_FIRST_START, saveIsFirstStart } from "@/services/auth/storage.ts";
import { AnimatePresence } from "framer-motion";
import { LessonPageLoading } from "./loading";
import React from "react";
import { LessonComplete } from "./LessonComplete";
import { useParams, useSearchParams } from "react-router-dom";
import { Guess } from "@/models/Session";
import { useEffect, useState, useMemo } from "react";

declare let Telegram: any;

const defaultStats = {
  total: 0,
  completed: 0,
  correct: 0,
  index: 1,
};

export default function LessonPage() {
  const [isFirstStart, setIsFirstStart] = useState<boolean | null>(null); // Состояние для первого запуска
  const [isReady, setIsReady] = useState(false); // Новое состояние для отслеживания готовности данных
  const params = useParams();
  const [searchParams] = useSearchParams(); // Извлекаем параметры из строки запроса
  const cloudStorage = useCloudStorage();

  const [completed, setCompleted] = React.useState(false);
  const [startDate, setStartDate] = React.useState<number | null>(null);
  const [stats, setStats] = React.useState(defaultStats);
  const [sessionKey, setSessionKey] = React.useState(Date.now());

  const taskAmount = Number(searchParams.get("amount")) || 10; // Получаем значение amount из параметров

  // Проверяем значение IS_FIRST_START при монтировании компонента
  useEffect(() => {
    cloudStorage
      .getItem(IS_FIRST_START)
      .then((value) => {
        const isFirstLaunch = value === "true"; // Преобразуем строку в булево значение
        setIsFirstStart(isFirstLaunch);
        setIsReady(true); // Данные готовы
        if (isFirstLaunch) {
          saveIsFirstStart('false'); // Сохраняем значение false после первого запуска
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении значения из cloud storage:", error);
        setIsReady(true); // Даже в случае ошибки отмечаем, что данные готовы
      });
  }, [cloudStorage]);

  // Вычисляем флаг is_onboarding только после получения значения isFirstStart
  const isOnboarding = useMemo(() => isFirstStart === true, [isFirstStart]);

  // Логируем значение isOnboarding только один раз
  useEffect(() => {
    if (isOnboarding !== undefined) {
      console.log("isOnboarding:", isOnboarding);
    }
  }, [isOnboarding]);

  const { data: session, isLoading, refetch } = useQuery({
    queryKey: ["tasks", sessionKey],
    queryFn: async () =>
      getTasks({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
        topic_id: params.topicId ? Number(params.topicId) : undefined,
        isHard: false,
        isWorkOnMistakes: params["*"] === "mistakes",
        amount: taskAmount, // Передаем amount в запрос
        is_onboarding: isOnboarding, // Добавляем флаг is_onboarding
      }),

    enabled: isReady, // Запрос выполняется только если данные готовы
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

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

      // Добавляем обработчик события закрытия мини-приложения
      const handlePopupClosed = async () => {
        console.log("abuba"); // Выводим сообщение в консоль при закрытии

        // Если сессия существует и дата начала установлена, отправляем запрос на завершение сессии
        if (session && startDate) {
          try {
            await completeSession({
              token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
              id: session.id,
              is_aborted: true, // Меняем флаг на true
              wastedTime: new Date().getTime() - startDate,
              guesses: [], // Передаем пустой массив, так как данные о догадках могут быть неизвестны
            });
            console.log("Сессия завершена с флагом is_aborted: true");
          } catch (e) {
            console.error("Ошибка при завершении сессии:", e);
          }
        }
      };

      tg.onEvent("popupClosed", handlePopupClosed);

      return () => {
        tg.disableVerticalSwipes();
        tg.enableClosingConfirmation();
        tg.offEvent("popupClosed", handlePopupClosed); // Удаляем обработчик при размонтировании
      };
    }
  }, [session, startDate, cloudStorage]);


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
