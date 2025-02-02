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
  const [taskAmount, setTaskAmount] = useState<number>(10);
  const [visibleMarks, setVisibleMarks] = useState<number[]>([]);
  // Определение ссылки для навигации
  const linkPath = params.topicId
    ? `/lesson/topic/${params.topicId}?amount=${taskAmount}`
    : params["*"] === "mistakes"
    ? `/lesson/mistakes?amount=${taskAmount}`
    : `/lesson/mistakes?amount=${taskAmount}`;
  // Возможные значения для ползунка
  const sliderValues = [10, 30, 50, 80, 100];
  
  useEffect(() => {
    const updateVisibleMarks = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        // На маленьких экранах показываем только некоторые метки
        setVisibleMarks([10, 30, 50, 80, 100]);
      } else {
        setVisibleMarks(sliderValues);
      }
    };
    updateVisibleMarks();
    window.addEventListener('resize', updateVisibleMarks);
    return () => window.removeEventListener('resize', updateVisibleMarks);
  }, []);
  
  // Функция для обновления значения слайдера, округляя до ближайшего значения из массива
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    const value = sliderValues[index];
    if (value !== undefined) {
      setTaskAmount(value);
    }
  };

  return (
    <AnimatePresence>
      <BackButton onClick={() => navigate("/")} />
      <div className={styles.page}>
        <header className={styles.page__header}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </header>
        <div className={styles.page__content}>
          <div className={styles.slider__container}>
            <label htmlFor="taskAmount" className={styles.slider__label}>
              Количество заданий: <span>{taskAmount}</span>
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                id="taskAmount"
                type="range"
                min={0}
                max={sliderValues.length - 1}
                step={1}
                value={sliderValues.indexOf(taskAmount)}
                onChange={handleSliderChange} // Используем функцию здесь
                className={styles.slider}
              />
              <div className={styles.slider__marks}>
                {sliderValues.map((value, index) => (
                  visibleMarks.includes(value) && (
                    <span
                      key={value}
                      className={`${styles.slider__mark} ${
                        value === taskAmount ? styles["slider__mark--active"] : ""
                      } ${index === 0 ? styles["slider__mark--first"] : ""} ${index === sliderValues.length - 1 ? styles["slider__mark--last"] : ""}`}
                      style={{
                        flex: index === 0 || index === sliderValues.length - 1 ? '0.5' : '1',
                      }}
                    >
                      {index === 0 ? (
                        <span className={styles["slider__mark-text--left"]}>{value}</span>
                      ) : index === sliderValues.length - 1 ? (
                        <span className={styles["slider__mark-text--right"]}>{value}</span>
                      ) : (
                        value
                      )}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className={styles.page__footer}>
          <Button onClick={() => navigate(linkPath)}>НАЧАТЬ ТРЕНИРОВКУ!</Button>
        </footer>
      </div>
    </AnimatePresence>
  );
}

