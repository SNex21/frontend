import { Haptic } from "@/lib/twa/components/Haptic";
import { FlexedBicepsEmoji, PersonLiftingWeightsEmoji, WarningEmoji } from "@repo/ui/emojis";
import React, { FC } from "react";
import styles from "./WorkoutSection.module.scss";
import cn from "classnames";
import { Link } from "react-router-dom";
import { useFeatureFlagEnabled } from "posthog-js/react";

interface WorkoutCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isSm?: boolean;
  href?: string;
}

interface WorkoutCardBlockedProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isSm?: boolean;
  href?: string;
}


const WorkoutSection: FC = () => {
  const showHardLessonButton = useFeatureFlagEnabled("hard-lesson-button");

  return (
    <section className="wrapper">
      <div className={styles.section}>
        <WorkoutCard
          title="Начать тренировку"
          description="по всем заданиям"
          icon={<FlexedBicepsEmoji size={25} />}
          href={"/lesson"}
        />
        <div className={styles.row}>
          <WorkoutCard title="Практика ошибок" icon={<WarningEmoji size={25} />} isSm href={"/lesson/mistakes"} />
          {showHardLessonButton && (
            <WorkoutCard
              title="Самые сложные"
              icon={<PersonLiftingWeightsEmoji size={25} />}
              isSm
              href={"/lesson/hard"}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const WorkoutCard: FC<WorkoutCardProps> = ({ icon, title, description, isSm = false, href = "" }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={href} className={styles.card}>
        {icon && <div className={styles.card__icon}>{icon}</div>}
        <div className={styles.card__content}>
          <h3
            className={cn(styles.card__content__title, {
              [styles.card__content__title_sm!]: isSm,
            })}
          >
            {title}
          </h3>
          {description && <p className={styles.card__content__description}>{description}</p>}
        </div>
      </Link>
    </Haptic>
  );
};

const WorkoutCardBlocked: FC<WorkoutCardBlockedProps> = ({ icon, title, description, isSm = false, href = "" }) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <Link to={href} className={styles.blocked_card}>
        {icon && <div className={styles.blocked_card__icon}>{icon}</div>}
        <div className={styles.blocked_card__content}>
          <h3
            className={cn(styles.blocked_card__content__title, {
              [styles.blocked_card__content__title_sm!]: isSm,
            })}
          >
            {title}
          </h3>
          {description && <p className={styles.blocked_card__content__description}>{description}</p>}
        </div>
      </Link>
    </Haptic>
  );
};

export { WorkoutSection };
