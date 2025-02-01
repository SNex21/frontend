import pageStyles from "../Page.module.scss";
import { GreetingSection } from "./GreetingSection";
import styles from "./Home.module.scss";
import { LessonsSection } from "./LessonsSection";
import { WorkoutSection } from "./WorkoutSection";
import { useEffect } from "react";
import Telegram from "@twa-dev/sdk"; // Используем дефолтный импорт

export default function HomePage() {
  useEffect(() => {
    if (Telegram) {
      // Telegram уже является экземпляром API, нет необходимости обращаться через .WebApp
      const tg = Telegram;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }

      // Включаем подтверждение перед закрытием приложения
      tg.enableClosingConfirmation();

      // Отключаем вертикальные свайпы для закрытия/минимизации приложения
      tg.disableVerticalSwipes();

      // Логирование информации о платформе и версии
      console.log("Telegram Web App Info:");
      console.log("Version:", tg.version);
      console.log("Platform:", tg.platform);
      console.log("Color Scheme:", tg.colorScheme);

      // Обработка изменения высоты видимой области
      const handleViewportChanged = (event: { isStateStable: boolean }) => {
        if (event.isStateStable) {
          console.log("Stable Viewport Height:", tg.viewportStableHeight);
        }
      };

      // Подписываемся на событие изменения высоты видимой области
      tg.onEvent("viewportChanged", handleViewportChanged);

      // Очистка эффекта при размонтировании компонента
      return () => {
        tg.disableClosingConfirmation(); // Отключаем подтверждение закрытия
        tg.enableVerticalSwipes(); // Включаем вертикальные свайпы
        tg.offEvent("viewportChanged", handleViewportChanged); // Отписываемся от события
      };
    }
  }, []);

  return (
    <div className={pageStyles.main}>
      <div className={styles.content}>
        <GreetingSection />
        <WorkoutSection />
        <LessonsSection />
      </div>
    </div>
  );
}
