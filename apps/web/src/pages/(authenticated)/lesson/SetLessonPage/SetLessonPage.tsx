import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./SetLessonPage.module.scss";

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

  // Возможные значения для ползунка
  const sliderValues = [15, 30, 60, 80, 100];

  // Функция для обновления значения, выбирая ближайшее из массива
  const handleSliderChange = (value: number) => {
    const closestValue = sliderValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    setTaskAmount(closestValue);
  };

  return (
    <AnimatePresence>
      <div className={styles.page}>
        <header className={styles.page__header}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </header>
        <div className={styles.page__content}>
          <label htmlFor="taskAmount" className={styles.slider__label}>
            Количество заданий: <span>{taskAmount}</span>
          </label>
          <input
            id="taskAmount"
            type="range"
            min={15}
            max={100}
            step={1} // Ползунок плавно передвигается
            value={taskAmount}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.slider__marks}>
            {sliderValues.map((value) => (
              <span
                key={value}
                className={`${styles.slider__mark} ${
                  value === taskAmount ? styles["slider__mark--active"] : ""
                }`}
              >
                {value}
              </span>
            ))}
          </div>
        </div>
        <footer className={styles.page__footer}>
          <Button onClick={() => navigate(linkPath)}>НАЧАТЬ ТРЕНИРОВКУ!</Button>
        </footer>
      </div>
    </AnimatePresence>
  );
}
