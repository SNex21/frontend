import pageStyles from "../Page.module.scss";
import { GreetingSection } from "./GreetingSection";
import styles from "./Home.module.scss";
import { LessonsSection } from "./LessonsSection";
import { WorkoutSection } from "./WorkoutSection";
import { useEffect } from "react";
import { Telegram } from "@twa-dev/sdk"; // Импортируем типы из @twa-dev/sdk

export default function HomePage() {
  // Используем useEffect для выполнения кода при монтировании компонента
  useEffect(() => {
    // Проверяем, существует ли экземпляр Telegram.WebApp
    if (Telegram?.WebApp) {
      const tg = Telegram.WebApp;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready(); // Вызываем ready(), чтобы убедиться, что API загружено
      }

      // Включаем подтверждение перед закрытием приложения
      tg.isClosingConfirmationEnabled = true;

      // Опционально: Отключаем подтверждение при размонтировании компонента
      return () => {
        tg.isClosingConfirmationEnabled = false;
      };
    }
  }, []); // Пустой массив зависимостей означает, что код выполнится только один раз при загрузке

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
