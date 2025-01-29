import { FC, PropsWithChildren } from "react";
import styles from "../Challenge.module.scss";
import { motion } from "framer-motion";

const ChallengeLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.div
      className={styles.layout}
      initial={{
        opacity: 0,
        transform: "translateX(100%)",
      }}
      animate={{
        opacity: 1,
        transform: "translateX(0)",
      }}
      exit={{
        opacity: 0,
        transform: "translateX(-100%)",
      }}
      transition={{
        duration: 2.0,
        ease: "ease",
      }}
    >
      {children}
    </motion.div>
  );
};

export { ChallengeLayout };
