import React from "react";
import { Haptic } from "@/lib/twa/components/Haptic.tsx";
import { Xmark } from "@repo/ui/icons";
import styles from "./LessonHeader.module.scss";
import { OverlaysPortal } from "@/components/shared/OverlaysPortal";
import { Button } from "@repo/ui";
import { LoudlyCryingFaceEmoji } from "@repo/ui/emojis";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { completeSession } from "@/services/api/tasks";
import { useCloudStorage } from "@/lib/twa/hooks";
import { Guess } from "@/models/Session";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage";

interface LessonHeaderProps {
  stats: { total: number; completed: number; index: number };
  session: { id: string; startDate: number; guesses: Guess[] };
}

const LessonHeader: React.FC<LessonHeaderProps> = ({ stats, session }) => {
  const cloudStorage = useCloudStorage();
  const navigate = useNavigate();
  const [opened, setOpened] = React.useState(false);
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  const openDrawer = React.useCallback(() => {
    setOpened(true);
  }, []);
  const closeDrawer = React.useCallback(() => {
    setOpened(false);
  }, []);

  const exit = React.useCallback(async () => {
    setOpened(false);
    try {
      await completeSession({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
        id: session.id,
        is_aborted: true,
        wastedTime: new Date().getTime() - session.startDate,
        guesses: session.guesses,
      });   
    } catch (e) {
      console.error(e);
    }
    navigate("/");
  }, []);

  const progress = React.useMemo(() => {
    if (!progressBarRef.current || stats.total === 0) {
      return 0;
    }

    const initial = 0.15 * progressBarRef.current.offsetWidth;
    const solved = (stats.completed / stats.total) * 0.85 * progressBarRef.current.offsetWidth;
    return initial + solved;
  }, [stats, progressBarRef.current]);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Haptic type={"impact"} value={"light"} asChild>
          <button className={styles.content__button} onClick={openDrawer}>
            <Xmark size={20} />
          </button>
        </Haptic>
        <AnimatePresence>
          {opened && (
            <>
              <OverlaysPortal>
                <motion.div
                  className={styles.tint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { delay: 0.4 } }}
                />
              </OverlaysPortal>
              <OverlaysPortal>
                <motion.div
                  className={styles.drawer}
                  initial={{ bottom: "-100%" }}
                  animate={{
                    bottom: "0",
                    transition: { ease: [0, 0.4, 0, 1], duration: 0.4, delay: 0.3 },
                  }}
                  exit={{ bottom: "-100%" }}
                >
                  <div className={styles.drawer__info}>
                    <LoudlyCryingFaceEmoji size={70} />
                    <h1 className={styles.drawer__info__title}>Постойте! Уже уходите?</h1>
                    <p className={styles.drawer__info__subtitle}>
                      Если закончить сейчас,
                      <br /> прогресс не сохранится
                    </p>
                  </div>
                  <div className={styles.drawer__buttons}>
                    <Haptic type={"impact"} value={"medium"} asChild>
                      <Button onClick={closeDrawer}>ПРОДОЛЖИТЬ УЧЕБУ</Button>
                    </Haptic>
                    <Haptic type={"impact"} value={"medium"} asChild>
                      <Button onClick={exit} className={styles.drawer__buttons__destructive}>
                        ВЫЙТИ
                      </Button>
                    </Haptic>
                  </div>
                </motion.div>
              </OverlaysPortal>
            </>
          )}
        </AnimatePresence>
        <div className={styles.content__progress} ref={progressBarRef}>
          <motion.div className={styles.content__progress__line} animate={{ width: `${progress}px` }}>
            <span>{stats.index}/{stats.total}</span>
          </motion.div>
        </div>
        <div className={styles.content__empty} />
      </div>
    </header>
  );
};

export { LessonHeader };
