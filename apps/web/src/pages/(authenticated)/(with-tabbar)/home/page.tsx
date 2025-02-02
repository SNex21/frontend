import pageStyles from "../Page.module.scss";
import { GreetingSection } from "./GreetingSection";
import styles from "./Home.module.scss";
import { LessonsSection } from "./LessonsSection";
import { WorkoutSection } from "./WorkoutSection";
import { useEffect } from "react";

// Используем дефолтный импорт Telegram Web App API
declare let Telegram: any; // Объявляем глобальный объект Telegram

export default function HomePage() {
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
