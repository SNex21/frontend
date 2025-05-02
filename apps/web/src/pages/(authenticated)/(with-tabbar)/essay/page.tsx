import styles from "./Essay.module.scss";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { getEssaysTopics, getUserEssays } from "@/services/api/essays";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Skeleton } from "@repo/ui";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Haptic } from "@/lib/twa/components/Haptic";


declare let Telegram: any;

// Тип для статуса сочинения
type EssayStatus = "bought" | "in_progress" | "in_review" | "reviewed";

export default function EssayPage() {
  useEffect(() => {
    if (Telegram && Telegram.WebApp) {
      const tg = Telegram.WebApp;

      if (tg.ready) {
        tg.ready();
      }

      tg.disableVerticalSwipes();
      tg.enableClosingConfirmation();

      return () => {
        tg.disableVerticalSwipes();
        tg.enableClosingConfirmation();
      };
    }
  }, []);

  const cloudStorage = useCloudStorage();

  const {
    data: topicsData,
    isLoading: topicsLoading,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getEssaysTopics({ token });
    },
  });

  const {
    data: userEssaysData,
    isLoading: userEssaysLoading,
  } = useQuery({
    queryKey: ["userEssays"],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getUserEssays({ token });
    },
  });

  const isLoading = topicsLoading || userEssaysLoading;
  const isDataReady = topicsData && userEssaysData;

  if (isLoading || !isDataReady) {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <div className={styles.card} key={i}>
            <Skeleton style={{ height: "157px", borderRadius: "var(--rounded-2xl)" }} />
          </div>
        ))}
      </>
    );
  }

  // Маппинг статусов
  const statusMap: Record<EssayStatus, { label: string; className: string }> = {
    bought: {
      label: "Куплено",
      className: styles.statusBought ?? "",
    },
    in_progress: {
      label: "В процессе",
      className: styles.statusInProgress ?? "",
    },
    in_review: {
      label: "На проверке",
      className: styles.statusInReview ?? "",
    },
    reviewed: {
      label: "Проверено",
      className: styles.statusReviewed ?? "",
    },
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h1 className={styles.title}>Твои сочинения</h1>
        <div className={styles.essayList}>
          {/* Если сочинений нет — центрированный текст */}
          {userEssaysData.length === 0 ? (
            <div className={styles.emptyPlaceholderContainer}>
              тут будут отображаться твои сочинения
            </div>
          ) : (
            /* Если есть сочинения */
            userEssaysData.map((essay, index) => {
              const essayStatus = essay.status as EssayStatus;
              const currentStatus =
                statusMap[essayStatus] || {
                  label: "Неизвестно",
                  className: styles.statusUnknown ?? "",
                };

              return (
                <Haptic type="impact" value="medium" asChild>
                  <Link to={`/essay/${essay.id}`}>
                  <div className={styles.essayItem} key={index}>
                    <span>{essay.title}</span>
                    <div className={currentStatus.className}>
                      <span>{currentStatus.label}</span>
                    </div>
                  </div>
                  </Link>
                </Haptic>
              );
            })
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Магазин сочинений</h2>
        <div className={styles.shopGrid}>
          {topicsData.map((topic, index) => (
         <Haptic type="impact" value="medium" asChild>
            <Link to={`/essay/${topic.id}`}>
            <div className={styles.card} key={index}>
              <img className={styles.cardImage} src={topic.image_url} alt="" />
              <div className={styles.cardText}>{topic.title}</div>
            </div>
            </Link>
        </Haptic>
          ))}
        </div>
      </section>
    </div>
  );
}
