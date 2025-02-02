// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./pages/router";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/assets/fonts/GeistSans.scss";
import "@/assets/fonts/Montserrat.scss";
import WebApp from "@twa-dev/sdk"; // Используем дефолтный импорт для Telegram Web App API

// Создаем экземпляр QueryClient
const queryClient = new QueryClient();

// Функция для инициализации Telegram Web App
const initializeTelegramWebApp = () => {
  if (WebApp) {
    const tg = WebApp;

    // Проверяем, готов ли Web App
    if (tg.ready) {
      tg.ready();
    }

    // Разворачиваем приложение на весь экран
    if (typeof tg.expand === "function") {
      tg.expand();
    }

    // Отключаем вертикальные свайпы
    if (typeof tg.disableVerticalSwipes === "function") {
      tg.disableVerticalSwipes();
    }

    // Включаем подтверждение закрытия приложения
    if (typeof tg.enableClosingConfirmation === "function") {
      tg.enableClosingConfirmation();
    }

    // Очистка эффекта при размонтировании или выходе из приложения
    return () => {
      if (typeof tg.enableVerticalSwipes === "function") {
        tg.enableVerticalSwipes(); // Включаем вертикальные свайпы
      }

      if (typeof tg.disableClosingConfirmation === "function") {
        tg.disableClosingConfirmation(); // Отключаем подтверждение закрытия
      }
    };
  }
};

// Главная функция рендера приложения
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <PostHogProvider>
        <ThemeProvider storageKey="uchi.theme">
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </PostHogProvider>
    </React.StrictMode>,
  );
};

// Инициализация Telegram Web App и рендеринг приложения
if (WebApp) {

  // Используем useEffect-подобную логику через обычный useEffect заменитель
  const cleanup = initializeTelegramWebApp();

  // Вызываем очистку перед выходом из приложения
  window.addEventListener("beforeunload", () => {
    if (cleanup) {
      cleanup();
    }
  });

  // Рендерим приложение после инициализации Telegram Web App
  renderApp();
} else {
  // Если Telegram Web App не доступен, просто рендерим приложение
  renderApp();
}
