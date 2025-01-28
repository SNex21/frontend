import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./SetLessonPage.module.scss";

export default function SetLessonPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [taskAmount, setTaskAmount] = useState<number>(10); // Добавляем состояние для количества заданий

  const linkPath = params.topicId 
    ? `/lesson/topic/${params.topicId}?amount=${taskAmount}` 
    : params["*"] === "mistakes" 
    ? `/lesson/mistakes?amount=${taskAmount}` 
    : `/lesson/mistakes?amount=${taskAmount}`;

  return (
    <AnimatePresence>
      <div className={styles.page}>
        <header className={styles.page__header}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </header>
        <div className={styles.page__content}>
          <label htmlFor="taskAmount">Количество заданий:</label>
          <input
            id="taskAmount"
            type="number"
            value={taskAmount}
            onChange={(e) => setTaskAmount(Number(e.target.value))}
            min={1}
            max={100}
          />
        </div>
        <footer className={styles.page__footer}>
          <Button onClick={() => navigate(linkPath)}>НАЧАТЬ ТРЕНИРОВКУ!</Button>
        </footer>
      </div>
    </AnimatePresence>
  );
}
