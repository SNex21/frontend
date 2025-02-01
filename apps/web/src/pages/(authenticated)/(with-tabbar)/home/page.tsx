import pageStyles from "../Page.module.scss";
import { GreetingSection } from "./GreetingSection";
import styles from "./Home.module.scss";
import { LessonsSection } from "./LessonsSection";
import { WorkoutSection } from "./WorkoutSection";
import { useEffect } from "react";

export default function HomePage() {
  // Используем useEffect для выполнения кода при монтировании компонента
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Запрещаем закрытие приложения через жесты
      tg.MainButton.preventClosing();

      // Опционально: Разрешаем закрытие при размонтировании компонента
      return () => {
        tg.MainButton.allowClosing();
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
