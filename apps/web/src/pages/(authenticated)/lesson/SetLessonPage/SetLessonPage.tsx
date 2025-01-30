import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./SetLessonPage.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";
import HorizontalWheelSelector from "./HorizontalWheelSelector";

export default function SetLessonPage() {
  const params = useParams();
  const navigate = useNavigate();
  // Состояние для выбора количества заданий
  const [taskAmount, setTaskAmount] = useState<number>(15);
  const [visibleMarks, setVisibleMarks] = useState<number[]>([]);
  // Определение ссылки для навигации
  const linkPath = params.topicId
    ? `/lesson/topic/${params.topicId}?amount=${taskAmount}`
    : params["*"] === "mistakes"
    ? `/lesson/mistakes?amount=${taskAmount}`
    : `/lesson/mistakes?amount=${taskAmount}`;
  // Возможные значения для ползунка
  const sliderValues = [10, 15, 30, 50, 80, 100];

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

  const wheelItems = sliderValues.map(value => ({
    value,
    label: value.toString(),
  }));

  const handleWheelChange = (value: number) => {
    setTaskAmount(value);
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
            <HorizontalWheelSelector items={wheelItems} onChange={handleWheelChange} />
          </div>
        </div>
        <footer className={styles.page__footer}>
          <Button onClick={() => navigate(linkPath)}>НАЧАТЬ ТРЕНИРОВКУ!</Button>
        </footer>
      </div>
    </AnimatePresence>
  );
}
