import styles from "./EssayDetail.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useQuery } from "@tanstack/react-query";
import { getEssay } from "@/services/api/essays";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { Skeleton } from "@repo/ui";

export default function EssayDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ essayId: string }>();
  const cloudStorage = useCloudStorage();

  const {
    data: essayData,
    isLoading: essayLoading,
    error: essayError,
  } = useQuery({
    queryKey: ["essay", params.essayId],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      const essayId = Number(params.essayId);
      if (isNaN(essayId)) {
        throw new Error("Некорректный ID эссе");
      }
      return getEssay({ id: essayId, token });
    },
    enabled: !!params.essayId,
  });

  if (essayLoading || !essayData) {
    return <EssaySectionLoading />;
  }

  if (essayError) {
    return <div className={styles.error}>Ошибка загрузки эссе</div>;
  }

  return (
    <>
      <BackButton onClick={() => navigate("/essay")} />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <img
            className={styles.image}
            src={essayData.image_url}
            alt={essayData.title}
          />
          <div className={styles.content}>
            <h1 className={styles.title}>{essayData.title}</h1>
            <p className={styles.description}>{essayData.description}</p>
          </div>
        </div>

        {/* Секция: купленные сочинения */}
        <section className={styles.section}>
        <h2 className={styles.subtitle}>Твои сочинения</h2>
        <div className={styles.essayList}>
          {/* Если сочинений нет — центрированный текст */}
          {essayData.purchased_essays.length === 0 ? (
            <div className={styles.emptyPlaceholderContainer}>
              тут будут отображаться твои сочинения
            </div>
          ) : (
            /* Если есть сочинения */
            essayData.purchased_essays.map((essay, index) => {
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

        <div className={styles.complete}>
          <button className={styles.button}>Купить</button>
        </div>
      </div>
    </>
  );
}

const EssaySectionLoading = () => (
  <section className="wrapper">
    <div className={styles.cards}>
      <Skeleton
        style={{
          height: "65px",
          borderRadius: "var(--rounded-2xl)",
          gridColumn: "span 2",
        }}
      />
    </div>
  </section>
);
