import { FC } from "react";
import styles from "./Essay.module.scss";
import cn from "classnames";
import { useQuery } from "@tanstack/react-query";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Topic } from "@/models/Topic.ts";
import { Skeleton } from "@repo/ui";
import { getTasksTopics } from "@/services/api/tasks";

const EssaySection: FC = () => {
  return (
    <section className={cn("wrapper", styles.section)}>
      <h2 className={styles.section__heading}>Подучим теорию?</h2>
      <LessonCards />
    </section>
  );
};

const LessonCards: FC = () => {
  const cloudStorage = useCloudStorage();
  const { data, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () =>
      getTasksTopics({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  if (isLoading || !data) {
    return (
      <div className={styles.cards}>
        {[...Array(6).keys()].map((i) => (
          <Skeleton key={i} style={{ height: "157px", borderRadius: "var(--rounded-2xl)" }} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.cards}>
      {data.map((topic) => (
        <LessonCard key={topic.slug} {...topic} />
      ))}
    </div>
  );
};

const LessonCard: FC<Topic> = ({title, ege_number }) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        {ege_number && <span className={styles.card__content__number}>№{ege_number}</span>}
        <h3 className={styles.card__content__title}>{title}</h3>
      </div>
    </div>
  );
};

export { EssaySection };
