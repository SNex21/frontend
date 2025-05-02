import styles from "./Essay.module.scss";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { getEssaysTopics, getUserEssays } from "@/services/api/essays";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Skeleton } from "@repo/ui";
import { useEffect } from "react";

declare let Telegram: any;

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

  const { data: shopList, isLoading: isLoadingShop } = useQuery({
    queryKey: ["topics"],
    queryFn: async () =>
      getEssaysTopics({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  const { data: userEssayList, isLoading: isLoadingUserEssays } = useQuery({
    queryKey: ["userEssays"],
    queryFn: async () =>
      getUserEssays({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  const statusMap: Record<EssayStatus, { label: string; className: string }> = {
    bought: { label: "Куплено", className: styles.statusBought },
    in_progress: { label: "В процессе", className: styles.statusInProgress },
    in_review: { label: "На проверке", className: styles.statusInReview },
    reviewed: { label: "Проверено", className: styles.statusReviewed },
  };

  if (isLoadingShop || isLoadingUserEssays || !shopList || !userEssayList) {
    return (
      <>
        {[...Array(6)].map((i) => (
          <div className={styles.card} key={i}>
            <Skeleton key={i} style={{ height: "157px", borderRadius: "var(--rounded-2xl)" }} />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h1 className={styles.title}>Твои сочинения</h1>
        <div className={styles.essayList}>
          {userEssayList.map((essay, index) => {
            const statusInfo = statusMap[essay.status] || {
              label: "Неизвестно",
              className: styles.statusUnknown,
            };

            return (
              <div className={styles.essayItem} key={index}>
                <span>{essay.title}</span>
                <span className={statusInfo.className}>{statusInfo.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Магазин сочинений</h2>
        <div className={styles.shopGrid}>
          {shopList.map((essay, index) => (
            <div className={styles.card} key={index}>
              <img className={styles.cardImage} src={essay.image_url} alt="" />
              <div className={styles.cardText}>{essay.title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
