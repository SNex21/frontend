import styles from "./UserEssay.module.scss";
import { getUserEssay, getEssay, patchStartEssay } from "@/services/api/essays";
import { useQuery } from "@tanstack/react-query";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage";
import { useParams } from "react-router-dom";
import { FileEmoji } from "@repo/ui/emojis";
import { BackButton } from "@/lib/twa/components/BackButton";
import { Skeleton } from "@repo/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function UserEssayPage() {
  const params = useParams<{ purchaseEssayId: string }>();
  const cloudStorage = useCloudStorage();
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // First query to fetch user essay data
  const {
    data: userEssayData,
    isLoading: userEssayLoading,
    error: userEssayError,
  } = useQuery({
    queryKey: ["userEssays", params.purchaseEssayId],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      const purchaseEssayId = String(params.purchaseEssayId);
      return getUserEssay({ id: purchaseEssayId, token });
    },
    enabled: !!params.purchaseEssayId,
  });

  // Second query to fetch the base essay (depends on userEssayData)
  const {
    data: essayData,
    isLoading: essayLoading,
    error: essayError,
  } = useQuery({
    queryKey: ["essays", userEssayData?.essay_id],
    queryFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getEssay({ id: userEssayData!.essay_id, token });
    },
    enabled: !!userEssayData,
  });

  const startEssayMutation = useMutation({
    mutationFn: async ({ essay_id, deadline }: { essay_id: string; deadline: string }) => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return patchStartEssay({ essay_id: essay_id, token, deadline });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userEssays", params.purchaseEssayId] });
      queryClient.invalidateQueries({ queryKey: ["essays", userEssayData?.essay_id] });
    },
  });

  // Loading states
  if (userEssayLoading || essayLoading) {
    return <UserEssaySectionLoading />;
  }

  // Error states
  if (userEssayError || essayError) {
    return <div className={styles.error}>Ошибка загрузки</div>;
  }

  // Data not ready yet
  if (!userEssayData || !essayData) {
    return <UserEssaySectionLoading />;
  }

  return (
    <>
      <BackButton onClick={() => window.history.back()} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{essayData.title}</h1>

        {userEssayData.status === "bought" ? (
          <BoughtEssayView
            userEssayData={userEssayData}
            onStartClick={() => setModalOpen(true)}
          />
        ) : (
         userEssayData.status === "in_progress" ? (
            <InProgressEssayView userEssayData={userEssayData} />
         ):(
            userEssayData.status === "in_review" ? (
            <InProgressEssayView userEssayData={userEssayData} />):(
                <ReviewedEssayView userEssayData={userEssayData} />
            )
         )
        )}
      </div>

      <DeadlineModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(deadline) => {
          startEssayMutation.mutate(
            {
              essay_id: userEssayData.id,
              deadline,
            },
            {
              onSuccess: () => setModalOpen(false),
            }
          );
        }}
      />
    </>
  );
}

const BoughtEssayView = ({
  userEssayData,
  onStartClick,
}: {
  userEssayData: any;
  onStartClick: () => void;
}) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <span className={styles.fileName}>Текст появится после старта</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус: <span className={styles.statusBought}>не начато{userEssayData.deadline} - это фикс на деве так нада</span>
      </p>
      <p>Выбрать дедлайн: —</p>
    </div>

    <div className={styles.complete}>
      <button className={styles.button} onClick={onStartClick}>
        Начать
      </button>
    </div>
  </>
);

const InProgressEssayView = ({ userEssayData }: { userEssayData: any }) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <span className={styles.fileName}>26.pdf</span>
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Твое сочинение</h2>
      <div className={styles.fileBox}>
        <img src="/icons/folder-icon.png" alt="file" className={styles.fileIcon} />
        <span className={styles.fileName}>{userEssayData.download_essay_file_url}</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус:{" "}
        <span className={`${styles[`status${capitalizeFirstLetter(userEssayData.status)}`]}`}>
          {translateStatus(userEssayData.status)}
        </span>
      </p>
      <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
    </div>

    <div className={styles.section}>
      <h1 className={styles.subtitle}>Итоговый балл: 15/26</h1></h2>
    </div>

    <div className={styles.section}>
    <h2 className={styles.subtitle}>Рецензия проверяющего</h2>
        <div className={styles.fileBox}>
            <p>Сочинение соответствует теме и строится на материале указанного произведения. Автор раскрывает проблему взаимоотношений отцов и детей на примере Печорина и Максима Максимыча в романе «Герой нашего времени». Приведены два аргумента: отношение Печорина к старому знакомому и его внутреннее одиночество. Однако анализ недостаточно глубок, выводы не всегда связаны с текстом. Стиль речи соответствует нормам, но наблюдаются отдельные нарушения в построении предложений. Оценка: 2 из 5.</p>
        </div>
    </div>
  </>
);

const ReviewedEssayView = ({ userEssayData }: { userEssayData: any }) => (
    <>
      <div className={styles.section}>
        <h2 className={styles.subtitle}>Текст сочинения</h2>
        <div className={styles.fileBox}>
          <FileEmoji size={25} />
          <span className={styles.fileName}>26.pdf</span>
        </div>
      </div>
  
      <div className={styles.section}>
        <h2 className={styles.subtitle}>Твое сочинение</h2>
        <div className={styles.fileBox}>
        <FileEmoji size={25} />
          <span className={styles.fileName}>{userEssayData.download_essay_file_url}</span>
        </div>
      </div>
  
      <div className={styles.statusBlock}>
        <p>
          Статус:{" "}
          <span className={`${styles[`status${capitalizeFirstLetter(userEssayData.status)}`]}`}>
            {translateStatus(userEssayData.status)}
          </span>
        </p>
        <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
      </div>
  
      <div className={styles.complete}>
        <button className={styles.button}>Отправить решение</button>
      </div>
    </>
  );  

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const translateStatus = (status: string) => {
  switch (status) {
    case "in_progress":
      return "в процессе";
    case "in_review":
      return "на проверке";
    case "reviewed":
      return "проверено";
    default:
      return status;
  }
};

const DeadlineModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deadline: string) => void;
}) => {
  const [deadline, setDeadline] = useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>Поставь себе дедлайн</h3>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split("T")[0]} // сегодня и далее
        />
        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.secondaryButton}>
            Отмена
          </button>
          <button
            onClick={() => onSubmit(deadline)}
            disabled={!deadline}
            className={styles.button}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

const UserEssaySectionLoading = () => (
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
