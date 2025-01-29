import { FC } from "react";
import styles from "./GreetingSection.module.scss";
import { useUser } from "@/providers/AuthProvider/AuthProvider";

const GreetingSection: FC = () => {
  const user = useUser();

  return (
    <section className="wrapper">
      <div className={styles.greeting}>
        <h1 className={styles.greeting__heading}>
          Привет, <span className={styles.greeting__user}>{user.username}</span>
        </h1>
        <p className={styles.greeting__subheading}>
          Что будем тренировать сегодня?
        </p>
      </div>
    </section>
  );
};


export { GreetingSection };
