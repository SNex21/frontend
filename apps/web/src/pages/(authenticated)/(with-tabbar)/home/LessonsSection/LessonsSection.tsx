import { FC } from "react";
import styles from "./LessonSection.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic";
import cn from "classnames";
import { useQuery } from "@tanstack/react-query";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ArrowIcon } from "@repo/ui/icons";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Topic } from "@/models/Topic.ts";
import { Skeleton } from "@repo/ui";
import { getTasksTopics } from "@/services/api/tasks";
import { Link } from "react-router-dom";
import { useUser } from "@/providers/AuthProvider/AuthProvider";
import Blocked from "../../../../../assets/fonts/images/Blocked.png";


const LessonsSection: FC = () => {
  return (
    <section className={cn("wrapper", styles.section)}>
      <h2 className={styles.section__heading}>По заданиям</h2>
      <LessonCards />
    </section>
  );
};

interface SubscriptionCardProps {
  emoji?: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  description?: string;
  isSm?: boolean;
  href?: string;
}

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

  const user = useUser();

  return (
      <>
        {!user.subscription ? (
            <SubscriptionCard
            title="Открывай доступ ко всем заданиям вместе с подпиской!"
            href={"/subscription"}
            icon={<ArrowIcon size={25} />}
          />
          ) : null}
      <div className={styles.cards}>
      {data.map((topic) => (
        topic.private && !user.subscription ? (
          <LessonCardBlocked key={topic.slug} {...topic} />
        ) : (
          <LessonCard key={topic.slug} {...topic} />
        )
      ))}
    </div>
    </>
  );
};

const LessonCard: FC<Topic> = ({id, title, ege_number }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={`/set/lesson/${id}`}>
        <div className={styles.card}>
          <div className={styles.card__content}>
            {ege_number && <span className={styles.card__content__number}>№{ege_number}</span>}
            <h3 className={styles.card__content__title}>{title}</h3>
          </div>
        </div>
      </Link>
    </Haptic>
  );
};

const LessonCardBlocked: FC<Topic> = ({title, ege_number }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <div className={styles.blocked_card}>
        <div className={styles.blocked_card__content}>
          {ege_number && <span className={styles.blocked_card__content__number}>№{ege_number}</span>}
          <img
            src={Blocked}
            alt="блок"
            className={styles.blocked_logo} />
          <h3 className={styles.blocked_card__content__title}>{title}</h3>
        </div>
      </div>
    </Haptic>
  );
};

const SubscriptionCard: FC<SubscriptionCardProps> = ({ emoji, title, description, icon, isSm = false, href = "" }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={href} className={styles.subscription_card}>
      {emoji && <div className={styles.subscription_card__emoji}>{emoji}</div>}
        <div className={styles.subscription_card__content}>
          <h3
            className={cn(styles.subscription_card__content__title, {
              [styles.subscription_card__content__title_sm!]: isSm,
            })}>
            {title}
          </h3>
          {description && <p className={styles.subscription_card__content__description}>{description}</p>}
        </div>
        <div className={styles.subscription_card__icon}>
          <span className={styles.subscription_card__icon_arrow}>{icon}</span>
        </div>
      </Link>
    </Haptic>
  );
};

export { LessonsSection };
