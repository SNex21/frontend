import { Haptic } from "@/lib/twa/components/Haptic";
import { FlexedBicepsEmoji, PersonLiftingWeightsEmoji, WarningEmoji, PhoneEmoji } from "@repo/ui/emojis";
import React, { FC, useEffect, useState } from "react";
import styles from "./WorkoutSection.module.scss";
import cn from "classnames";
import { Link } from "react-router-dom";
import { useUser } from "@/providers/AuthProvider/AuthProvider";
import { useFeatureFlagEnabled } from "posthog-js/react";
import Blocked from "../../../../../assets/fonts/images/Blocked.png";

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

declare let Telegram: any;

const WorkoutSection: FC = () => {
  const [showAddToHomeButton, setShowAddToHomeButton] = useState<boolean>(false);
  const showHardLessonButton = useFeatureFlagEnabled("hard-lesson-button");
  const user = useUser();

  useEffect(() => {
    if (Telegram && Telegram.WebApp) {
      const tg = Telegram.WebApp;

      // Проверяем, готов ли Web App
      if (tg.ready) {
        tg.ready();
      }

      // Отключаем вертикальные свайпы на этой странице
      tg.disableVerticalSwipes();

      // Включаем подтверждение закрытия приложения
      tg.enableClosingConfirmation();

      // Проверяем статус добавления на главный экран
      checkHomeScreenStatus(tg);

      // Подписываемся на событие homeScreenAdded
      if (typeof tg.onEvent === "function") {
        tg.onEvent("homeScreenAdded", () => {
          console.log("Mini App успешно добавлен на главный экран!");
          setShowAddToHomeButton(false); // Скрываем кнопку после добавления
        });
      }

      // Очистка эффекта при размонтировании компонента
      return () => {
        tg.enableVerticalSwipes(); // Включаем вертикальные свайпы
        tg.disableClosingConfirmation(); // Отключаем подтверждение закрытия
        if (typeof tg.offEvent === "function") {
          tg.offEvent("homeScreenAdded"); // Отписываемся от события
        }
      };
    }
  }, []);

  const checkHomeScreenStatus = (tg: any) => {
    if (tg && typeof tg.checkHomeScreenStatus === "function") {
      try {
        // Вызываем метод checkHomeScreenStatus и проверяем результат
        tg.checkHomeScreenStatus((result: string) => {
          // Убеждаемся, что result имеет допустимое значение
          if (result === "missed") {
            setShowAddToHomeButton(true); // Показываем кнопку, если ярлык не добавлен
          } else {
            setShowAddToHomeButton(false); // Скрываем кнопку в остальных случаях
          }
        });
      } catch (error) {
        console.error("Ошибка при проверке статуса добавления на главный экран:", error);
        setShowAddToHomeButton(false); // По умолчанию скрываем кнопку при ошибке
      }
    } else {
      setShowAddToHomeButton(false); // Если метод недоступен, скрываем кнопку
    }
  };

  // Функция для вызова addToHomeScreen
  const handleAddToHomeScreen = () => {
    if (Telegram && typeof Telegram.WebApp.addToHomeScreen === "function") {
      try {
        Telegram.WebApp.addToHomeScreen();
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
            </div>
            {/* Новая кнопка для добавления на главный экран */}
            {showAddToHomeButton && (
              <WorkoutCard
                title="Добавить на главный экран"
                icon={<PhoneEmoji size={32.5} />}
                isSm
                onClick={handleAddToHomeScreen} // Добавляем обработчик onClick
              />
            )}
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
            {showAddToHomeButton && (
              <WorkoutCard
                title="Добавить на главный экран"
                icon={<PhoneEmoji size={32.5} />}
                isSm
                onClick={handleAddToHomeScreen} // Добавляем обработчик onClick
              />
            )}
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
