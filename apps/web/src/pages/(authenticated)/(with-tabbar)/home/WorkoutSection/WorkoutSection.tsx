import { Haptic } from "@/lib/twa/components/Haptic";
import { FlexedBicepsEmoji, PersonLiftingWeightsEmoji, WarningEmoji } from "@repo/ui/emojis";
import React, { FC } from "react";
import styles from "./WorkoutSection.module.scss";
import cn from "classnames";
import { Link } from "react-router-dom";
import { useUser } from "@/providers/AuthProvider/AuthProvider";
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
}


const WorkoutSection: FC = () => {
  const showHardLessonButton = useFeatureFlagEnabled("hard-lesson-button");
  const user = useUser();

  return (
    <>
    {user.subscription ? 
    (<section className="wrapper">
      <div className={styles.section}>
        <WorkoutCard
          title="Начать тренировку"
          description="по всем заданиям"
          icon={<FlexedBicepsEmoji size={25} />}
          href={"/set/lesson"}
        />
        <div className={styles.row}>
          <WorkoutCard title="Практика ошибок" icon={<WarningEmoji size={25} />} isSm href={"/set//lesson/mistakes"} />
          {showHardLessonButton && (
            <WorkoutCard
              title="Самые сложные"
              icon={<PersonLiftingWeightsEmoji size={25} />}
              isSm
              href={"/set/lesson/hard"}
            />
          )}
        </div>
      </div>
    </section>) : (
      <section className="wrapper">
      <div className={styles.section}>
        <WorkoutCardBlocked
          title="Начать тренировку"
          description="по всем заданиям"
          icon={<FlexedBicepsEmoji size={25} />}
        />
        <div className={styles.row}>
          <WorkoutCardBlocked title="Практика ошибок" icon={<WarningEmoji size={25} />} isSm />
          {showHardLessonButton && (
            <WorkoutCardBlocked
              title="Самые сложные"
              icon={<PersonLiftingWeightsEmoji size={25} />}
              isSm
            />
          )}
        </div>
      </div>
    </section>
    )
}
  </>
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

const WorkoutCardBlocked: FC<WorkoutCardBlockedProps> = ({ icon, title, description, isSm = false}) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      <div className={styles.card}>
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
      </div>
    </Haptic>
  );
};

export { WorkoutSection };
