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

      // Включаем подтверждение закрытия приложения
      tg.enableClosingConfirmation();

      // Проверяем поддержку метода addToHomeScreen
      if (tg.isVersionAtLeast("8.0") && typeof tg.addToHomeScreen === "function") {
        try {
          // Подписываемся на событие homeScreenAdded, если оно доступно
          if (typeof tg.onEvent === "function") {
            tg.onEvent("homeScreenAdded", () => {
              console.log("Mini App успешно добавлен на главный экран!");
              alert("Mini App успешно добавлен на главный экран!");
            });
          }
        } catch (error) {
          console.error("Событие homeScreenAdded не поддерживается:", error);
        }
      }

      // Очистка эффекта при размонтировании компонента
      return () => {
        tg.enableVerticalSwipes(); // Включаем вертикальные свайпы
        tg.disableClosingConfirmation(); // Отключаем подтверждение закрытия
        if (typeof tg.offEvent === "function") {
          try {
            tg.offEvent("homeScreenAdded");
          } catch (error) {
            console.error("Ошибка отписки от события homeScreenAdded:", error);
          }
        }
      };
    }
  }, []);

  // Функция для вызова addToHomeScreen
  const handleAddToHomeScreen = () => {
    if (Telegram && Telegram.WebApp && typeof Telegram.WebApp.addToHomeScreen === "function") {
      try {
        Telegram.WebApp.addToHomeScreen();
      } catch (error) {
        alert("Метод добавления на главный экран недоступен.");
        console.error("Ошибка вызова addToHomeScreen:", error);
      }
    } else {
      alert("Метод добавления на главный экран не поддерживается.");
    }
  };

  return (
    <div className={pageStyles.main}>
      <div className={styles.content}>
        <GreetingSection />
        <WorkoutSection />
        <LessonsSection />

        {/* Кнопка для добавления на главный экран */}
        {Telegram && Telegram.WebApp && typeof Telegram.addToHomeScreen === "function" && (
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
