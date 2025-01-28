import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./SetLessonPage.module.scss";

export default function SetLessonPage() {
  const params = useParams();

  return (
    <AnimatePresence>
      <div className={styles.page}>
        <header className={styles.page__header}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </header>
        <div className={styles.page__content}>
          {/* Здесь можно добавить основной контент, если потребуется */}
        </div>
        <footer className={styles.page__footer}>
          <Link to={`/lesson/topic/${params.topicId}`} className={styles.page__button}>
            <Button>НАЧАТЬ ТРЕНИРОВКУ!</Button>
          </Link>
        </footer>

      </div>
    </AnimatePresence>
  );
}
