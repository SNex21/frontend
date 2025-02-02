// RootLayout.tsx
import { Outlet } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "@/styles/globals.scss";
import { TgBottomFix } from "@/components/layout/TgBottomFix";
import { Suspense, useEffect } from "react";
import WebApp from "@twa-dev/sdk"; // Используем дефолтный импорт для Telegram Web App API

dayjs.locale("ru");
dayjs.extend(customParseFormat);

export default function RootLayout() {
  useEffect(() => {
    if (WebApp) {
      const tg = WebApp;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }

      // Разворачиваем приложение на весь экран
      tg.expand();

      // Отключаем вертикальные свайпы глобально
      if (typeof tg.disableVerticalSwipes === "function") {
        tg.disableVerticalSwipes();
      }

      // Включаем подтверждение закрытия приложения
      if (typeof tg.enableClosingConfirmation === "function") {
        tg.enableClosingConfirmation();
      }

      // Очистка эффекта при размонтировании компонента
      return () => {
        if (typeof tg.enableVerticalSwipes === "function") {
          tg.enableVerticalSwipes();
        }
        if (typeof tg.disableClosingConfirmation === "function") {
          tg.disableClosingConfirmation();
        }
      };
    }
  }, []);

  return (
    <Suspense>
      <Outlet />
      <TgBottomFix />
    </Suspense>
  );
}
