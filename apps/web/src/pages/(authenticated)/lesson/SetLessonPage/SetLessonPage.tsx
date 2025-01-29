import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./SetLessonPage.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";

export default function SetLessonPage() {
  const params = useParams();
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

  // Функция для обновления значения счетчика, округляя до ближайшего значения из массива
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (isNaN(value)) {
      value = 10; // Значение по умолчанию, если введено некорректное значение
    }
    // Округляем значение до ближайшей точки из массива значений
    const closestValue = sliderValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    setTaskAmount(closestValue);
  };

  return (
    <AnimatePresence>
      <BackButton onClick={() => navigate("/")} />
      <div className={styles.page}>
        <header className={styles.page__header}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </header>
        <div className={styles.page__content}>
          <div className={styles.counter__container}>
            <label htmlFor="taskAmount" className={styles.counter__label}>
              Количество заданий:
            </label>
            <input
              id="taskAmount"
              type="number"
              min={10}
              max={100}
              step={1}
              value={taskAmount}
              onChange={handleInputChange}
              className={styles.counter__input}
            />
            <span className={styles.counter__value}>{taskAmount}</span>
          </div>
        </div>
        <footer className={styles.page__footer}>
          <Button onClick={() => navigate(linkPath)}>НАЧАТЬ ТРЕНИРОВКУ!</Button>
        </footer>
      </div>
    </AnimatePresence>
  );
}
 