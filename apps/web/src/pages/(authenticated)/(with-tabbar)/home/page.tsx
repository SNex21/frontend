import pageStyles from "../Page.module.scss";
import { GreetingSection } from "./GreetingSection";
import styles from "./Home.module.scss";
import { LessonsSection } from "./LessonsSection";
import { WorkoutSection } from "./WorkoutSection";
import { useEffect, useState } from "react";

// Используем дефолтный импорт Telegram Web App API
declare let Telegram: any; // Объявляем глобальный объект Telegram

export default function HomePage() {
  const [showAddToHomeButton, setShowAddToHomeButton] = useState<boolean>(false);

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

      // Проверяем статус добавления на главный экран
      checkHomeScreenStatus(tg);

      // Очистка эффекта при размонтировании компонента
      return () => {
        tg.enableVerticalSwipes(); // Включаем вертикальные свайпы
        tg.disableClosingConfirmation(); // Отключаем подтверждение закрытия
      };
    }
  }, []);

  // Функция для проверки статуса добавления на главный экран
  const checkHomeScreenStatus = (tg: any) => {
    if (tg.isVersionAtLeast("8.0") && typeof tg.checkHomeScreenStatus === "function") {
      try {
        tg.checkHomeScreenStatus((status: string) => {
          console.log("Статус добавления на главный экран:", status);

          // Определяем, показывать ли кнопку
          if (status === "missed") {
            setShowAddToHomeButton(true); // Показываем кнопку, если ярлык не добавлен
          } else {
            setShowAddToHomeButton(false); // Скрываем кнопку в остальных случаях
          }
        });
      } catch (error) {
        console.error("Ошибка при проверке статуса добавления на главный экран:", error);
      }
    } else {
      console.warn("Метод checkHomeScreenStatus не поддерживается.");
    }
  };

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
        {showAddToHomeButton && (
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
