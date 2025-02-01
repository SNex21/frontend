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

      // Включаем подтверждение закрытия приложения
      tg.enableClosingConfirmation();

      // Подписываемся на событие successful addition to home screen
      tg.onEvent("homeScreenAdded", () => {
        console.log("Mini App успешно добавлен на главный экран!");
        alert("Mini App успешно добавлен на главный экран!");
      });

      // Очистка эффекта при размонтировании компонента
      return () => {
        tg.enableVerticalSwipes(); // Включаем вертикальные свайпы
        tg.disableClosingConfirmation(); // Отключаем подтверждение закрытия
        tg.offEvent("homeScreenAdded"); // Отписываемся от события
      };
    }
  }, []);

  // Функция для вызова addToHomeScreen
  const handleAddToHomeScreen = () => {
    if (Telegram?.addToHomeScreen) {
      Telegram.addToHomeScreen();
    } else {
      alert("Метод добавления на главный экран недоступен.");
    }
  };

  return (
    <div className={pageStyles.main}>
      <div className={styles.content}>
        <GreetingSection />
        <WorkoutSection />
        <LessonsSection />

        {/* Кнопка для добавления на главный экран */}
        {Telegram?.addToHomeScreen && (
          <button
            onClick={handleAddToHomeScreen}
            className={styles.add_to_home_button}
            style={{
              display: "block",
              margin: "20px auto",
              padding: "10px 20px",
              backgroundColor: "var(--ds-primary)",
              color: "var(--ds-background-light)",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Добавить на главный экран
          </button>
        )}
      </div>
    </div>
  );
}
