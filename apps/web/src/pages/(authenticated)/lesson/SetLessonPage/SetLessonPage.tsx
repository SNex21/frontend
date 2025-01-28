import { Button } from "@repo/ui";
import { AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./SetLessonPage.module.scss";
// import cn from "classnames";


export default function SetLessonPage() {
  const params = useParams();

  return (
    <AnimatePresence>

        <div className={styles.page}>
        <h2 className={styles.section__heading}>Настрой свою тренировку</h2>
        <Link to={`/lesson/topic/${params.topicId}`}>
          <div className={styles.page__buttons}>
          <Button>НАЧАТЬ ТРЕНИРОВКУ!</Button> {/* Кнопка для начала новой сессии */}
          </div>
        </Link>
        </div>
    </AnimatePresence>
  );
}

