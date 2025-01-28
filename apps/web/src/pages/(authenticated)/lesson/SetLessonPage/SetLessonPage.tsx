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
        <div className={styles.page__content}>
          <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        </div>
        <div className={styles.page__buttons}>
          <Link to={`/lesson/topic/${params.topicId}`}>
            <Button>НАЧАТЬ ТРЕНИРОВКУ!</Button>
          </Link>
        </div>
      </div>
    </AnimatePresence>
  );
}
