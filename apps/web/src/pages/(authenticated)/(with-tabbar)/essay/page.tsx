import styles from "./Essay.module.scss";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { getEssaysTopics, getUserEssays } from "@/services/api/essays";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Skeleton } from "@repo/ui";
import { useEffect } from "react";

declare let Telegram: any;

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
  const { shopList, isLoadingShop } = useQuery({
    queryKey: ["topics"],
    queryFn: async () =>
      getEssaysTopics({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
    });
  const { userEssayList, isLoadingUserEssays } = useQuery({
    queryKey: ["topics"],
    queryFn: async () =>
      getUserEssays({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
    });
  if (isLoadingShop|| isLoadingUserEssays || !shopList || !userEssayList) {
    return (
      <>
        {[...Array(6).keys()].map((i) => (
          <div className={styles.card}>
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
          {userEssayList.map((essay, index) => (
            <div className={styles.essayItem} key={index}>
              <span>{essay.title}</span>
              <span
                className={
                  essay.status === 'in_review'
                    ? styles.statusChecked
                    : styles.statusPending
                }
              >
                {essay.status}
              </span>
            </div>
          ))}
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
