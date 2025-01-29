import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./SetLessonPage.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";
import NumberWheel from "./NumberWheel"; // Импортируем наш компонент NumberWheel

export default function SetLessonPage() {
  const params = useParams<{ topicId?: string; "*": string }>();
  const navigate = useNavigate();
  // Состояние для выбора количества заданий
  const [taskAmount, setTaskAmount] = useState<number>(15);
  // Определение ссылки для навигации
  const linkPath = params.topicId
    ? `/lesson/topic/${params.topicId}?amount=${taskAmount}`
    : params["*"] === "mistakes"
    ? `/lesson/mistakes?amount=${taskAmount}`
    : `/lesson/mistakes?amount=${taskAmount}`;
  // Возможные значения для счетчика
  const sliderValues = [10, 15, 30, 50, 80, 100];

  // Логика для определения текущей темы
  useEffect(() => {
    const isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, []);

  // Функция для обновления значения счетчика
  const handleValueChange = (newValue: number) => {
    setTaskAmount(newValue);
  };

  return (
    <AnimatePresence>
      <BackButton onClick={() => navigate("/")} />
      <div className={styles.page}>
        <header className={styles.page__header}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </header>
        <div className={styles.page__content}>
          <div className={styles.wheel__container}>
            <label htmlFor="taskAmount" className={styles.wheel__label}>
              Количество заданий:
            </label>
            <NumberWheel
              values={sliderValues}
              initialValue={taskAmount}
              onChange={handleValueChange}
            />
          </div>
        </div>
        <footer className={styles.page__footer}>
          <Button onClick={() => navigate(linkPath)}>НАЧАТЬ ТРЕНИРОВКУ!</Button>
        </footer>
      </div>
    </AnimatePresence>
  );
}
