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
      const tg = Telegram;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }

      // Отключаем вертикальные свайпы на этой странице
      tg.disableVerticalSwipes();

      // Очистка эффекта при размонтировании компонента
      return () => {
        // Включаем вертикальные свайпы, когда пользователь покидает страницу
        tg.enableVerticalSwipes();
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
