import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SetLessonPage() {
  const params = useParams();

  return (
    <AnimatePresence>
      <section className={cn("wrapper", styles.section)}>
        <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        <Link to={`/lesson/topic/${params.topicId}`}>
          <div className={styles.page__buttons}>
          <Button onClick={onRestart}>НАЧАТЬ ТРЕНИРОВКУ!</Button> {/* Кнопка для начала новой сессии */}
          </div>
        </Link>
      </section>
    </AnimatePresence>
  );
}

