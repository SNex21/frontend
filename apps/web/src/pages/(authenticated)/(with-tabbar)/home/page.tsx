import pageStyles from "../Page.module.scss";
import { GreetingSection } from "./GreetingSection";
import styles from "./Home.module.scss";
import { LessonsSection } from "./LessonsSection";
import { WorkoutSection } from "./WorkoutSection";
import { useEffect } from "react";
import Telegram from "@twa-dev/sdk"; // Используем дефолтный импорт

export default function HomePage() {
  useEffect(() => {
    if (Telegram?.WebApp) {
      const tg = Telegram.WebApp;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }

      // Включаем подтверждение перед закрытием приложения
      tg.isClosingConfirmationEnabled = true;

      // Опционально: Отключаем подтверждение при размонтировании компонента
      return () => {
        tg.isClosingConfirmationEnabled = false;
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

