import { Haptic } from "@/lib/twa/components/Haptic";
import { FlexedBicepsEmoji, PersonLiftingWeightsEmoji, WarningEmoji } from "@repo/ui/emojis";
import React, { FC } from "react";
import styles from "./WorkoutSection.module.scss";
import cn from "classnames";
import { Link } from "react-router-dom";
import { useUser } from "@/providers/AuthProvider/AuthProvider";
import { useFeatureFlagEnabled } from "posthog-js/react";
import Telegram from "@twa-dev/sdk"; // Используем дефолтный импорт

interface WorkoutCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isSm?: boolean;
  href?: string;
  onClick?: () => void; // Добавляем обработчик onClick
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

  // Функция для проверки статуса добавления на главный экран
  const checkHomeScreenStatus = (): "missed" | "added" | "unknown" | "unsupported" => {
    if (Telegram && typeof Telegram.checkHomeScreenStatus === "function") {
      let status: "missed" | "added" | "unknown" | "unsupported" = "unsupported";

      try {
        // Вызываем метод checkHomeScreenStatus и проверяем результат
        Telegram.checkHomeScreenStatus((result: string) => {
          // Убеждаемся, что result имеет допустимое значение
          if (
            ["missed", "added", "unknown", "unsupported"].includes(result)
          ) {
            status = result as "missed" | "added" | "unknown" | "unsupported";
          } else {
            status = "unsupported"; // Если результат неизвестен, считаем его "unsupported"
          }
        });
      } catch (error) {
        console.error("Ошибка при проверке статуса добавления на главный экран:", error);
        status = "unsupported"; // При ошибке считаем статус "unsupported"
      }

      return status;
    }

    return "unsupported"; // Если метод недоступен, считаем статус "unsupported"
  };

  // Флаг для отображения кнопки "Добавить на главный экран"
  const showAddToHomeButton =
    checkHomeScreenStatus() === "missed" && user.subscription;

  // Функция для вызова addToHomeScreen
  const handleAddToHomeScreen = () => {
    if (Telegram && typeof Telegram.addToHomeScreen === "function") {
      try {
        Telegram.addToHomeScreen();
      } catch (error) {
        alert("Метод добавления на главный экран недоступен.");
        console.error("Ошибка вызова addToHomeScreen:", error);
      }
    } else {
      alert("Метод добавления на главный экран не поддерживается.");
    }
  };

  return (
    <>
      {user.subscription ? (
        <section className="wrapper">
          <div className={styles.section}>
            <WorkoutCard
              title="Начать тренировку"
              description="по всем заданиям"
              icon={<FlexedBicepsEmoji size={25} />}
              href={"/set/lesson"}
            />
            <div className={styles.row}>
              <WorkoutCard
                title="Практика ошибок"
                icon={<WarningEmoji size={25} />}
                isSm
                href={"/set/lesson/mistakes"}
              />
              {showHardLessonButton && (
                <WorkoutCard
                  title="Самые сложные"
                  icon={<PersonLiftingWeightsEmoji size={25} />}
                  isSm
                  href={"/set/lesson/hard"}
                />
              )}
              {/* Новая кнопка для добавления на главный экран */}
              {showAddToHomeButton && (
                <WorkoutCard
                  title="Добавить на главный экран"
                  icon={<FlexedBicepsEmoji size={25} />}
                  isSm
                  onClick={handleAddToHomeScreen} // Добавляем обработчик onClick
                />
              )}
            </div>
          </div>
        </section>
      ) : (
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
      )}
    </>
  );
};

const WorkoutCard: FC<WorkoutCardProps> = ({
  icon,
  title,
  description,
  isSm = false,
  href = "",
  onClick, // Принимаем обработчик onClick
}) => {
  return (
    <Haptic type="impact" value="medium" asChild>
      {onClick ? (
        // Если есть onClick, используем div с обработчиком
        <div
          className={styles.card}
          onClick={onClick}
          style={{ cursor: "pointer" }}
        >
          {icon && <div className={styles.card__icon}>{icon}</div>}
          <div className={styles.card__content}>
            <h3
              className={cn(styles.card__content__title, {
                [styles.card__content__title_sm!]: isSm,
              })}
            >
              {title}
            </h3>
            {description && (
              <p className={styles.card__content__description}>{description}</p>
            )}
          </div>
        </div>
      ) : (
        // Иначе используем Link
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
            {description && (
              <p className={styles.card__content__description}>{description}</p>
            )}
          </div>
        </Link>
      )}
    </Haptic>
  );
};

const WorkoutCardBlocked: FC<WorkoutCardBlockedProps> = ({
  icon,
  title,
  description,
  isSm = false,
}) => {
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
          {description && (
            <p className={styles.blocked_card__content__description}>{description}</p>
          )}
        </div>
      </div>
    </Haptic>
  );
};

export { WorkoutSection };
