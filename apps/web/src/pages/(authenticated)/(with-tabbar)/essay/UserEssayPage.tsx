import styles from "./UserEssay.module.scss";
import { getUserEssay, getEssay } from "@/services/api/essays";
import { useQuery } from "@tanstack/react-query";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage";
import { useParams } from "react-router-dom";
import { BackButton } from "@/lib/twa/components/BackButton";
import { Skeleton } from "@repo/ui";

export default function UserEssayPage() {
  const params = useParams<{ essayId: string }>(); // ❗️ Обязательно строка
  const cloudStorage = useCloudStorage();

  const essayId = params.essayId;

  const {
    data: userEssayData,
    isLoading: userEssayLoading,
    error: userEssayError,
  } = useQuery({
    queryKey: ["userEssay", essayId],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      if (!essayId) throw new Error("ID эссе отсутствует");
      return getUserEssay({ id: essayId, token });
    },
    enabled: !!essayId,
  });

  if (userEssayLoading || !essayId) {
    return <UserEssaySectionLoading />;
  }

  if (userEssayError || !userEssayData) {
    return <div className={styles.error}>Ошибка загрузки</div>;
  }

  const {
    data: essayData,
    isLoading: essayLoading,
    error: essayError,
  } = useQuery({
    queryKey: ["essay", userEssayData.essay_id],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getEssay({ id: userEssayData.essay_id, token });
    },
    enabled: !!userEssayData?.essay_id,
  });

  if (essayLoading || !essayData) {
    return <UserEssaySectionLoading />;
  }

  if (essayError) {
    return <div className={styles.error}>Ошибка загрузки</div>;
  }

  return (
    <>
      <BackButton onClick={() => window.history.back()} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{essayData.title}</h1>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Текст сочинения</h2>
          <div className={styles.fileBox}>
            <img src="/icons/folder-icon.png" alt="file" className={styles.fileIcon} />
            <span className={styles.fileName}>26.pdf</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Твое сочинение</h2>
          <div className={styles.fileBox}>
            <img src="/icons/folder-icon.png" alt="file" className={styles.fileIcon} />
            <span className={styles.fileName}>{userEssayData.filename || "файл.docx"}</span>
          </div>
        </div>

        <div className={styles.statusBlock}>
          <p>
            Статус:{" "}
            <span className={styles.status}>{userEssayData.status}</span>
          </p>
          <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
}

const UserEssaySectionLoading = () => (
  <section className="wrapper">
    <div className="cards">
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
