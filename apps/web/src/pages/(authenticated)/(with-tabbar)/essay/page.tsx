import styles from "./Essay.module.scss";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { getEssaysTopics, getUserEssays } from "@/services/api/essays";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Skeleton } from "@repo/ui";
import { useEffect } from "react";

declare let Telegram: any;

// Типы для статуса сочинения
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
        {[...Array(6).keys()].map((i) => (
          <div className={styles.card} key={i}>
            <Skeleton style={{ height: "157px", borderRadius: "var(--rounded-2xl)" }} />
          </div>
        ))}
      </>
    );
  }

  // Маппинг статусов
  const statusMap = {
    bought: { label: "Куплено", className: styles.statusBought },
    in_progress: { label: "В процессе", className: styles.statusInProgress },
    in_review: { label: "На проверке", className: styles.statusInReview },
    reviewed: { label: "Проверено", className: styles.statusReviewed },
  } satisfies Record<EssayStatus, { label: string; className: string }>;

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h1 className={styles.title}>Твои сочинения</h1>
        <div className={styles.essayList}>
          {userEssaysData.map((essay, index) => {
            // Приводим essay.status к нужному типу
            const essayStatus = essay.status as EssayStatus;
            const currentStatus =
              statusMap[essayStatus] || {
                label: "Неизвестно",
                className: styles.statusUnknown,
              };

            return (
              <div className={`${styles.essayItem} ${currentStatus.className}`} key={index}>
                <span>{essay.title}</span>
                <span>{currentStatus.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Магазин сочинений</h2>
        <div className={styles.shopGrid}>
          {topicsData.map((topic, index) => (
            <div className={styles.card} key={index}>
              <img className={styles.cardImage} src={topic.image_url} alt="" />
              <div className={styles.cardText}>{topic.title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
