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
  const [deadline, setDeadline] = useState("");
  const [noDeadline, setNoDeadline] = useState(false);
  const [, setStarted] = useState(false); /
  const queryClient = useQueryClient();

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
    mutationFn: async ({
      essay_id,
      deadline,
    }: {
      essay_id: string;
      deadline?: string;
    }) => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return patchStartEssay(
        deadline ? { essay_id, token, deadline } : { essay_id, token }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userEssays", params.purchaseEssayId] });
      queryClient.invalidateQueries({ queryKey: ["essays", userEssayData?.essay_id] });
    },
  });

  if (userEssayLoading || essayLoading) {
    return <UserEssaySectionLoading />;
  }

  if (userEssayError || essayError) {
    return <div className={styles.error}>Ошибка загрузки</div>;
  }

  if (!userEssayData || !essayData) {
    return <UserEssaySectionLoading />;
  }

  return (
    <>
      <BackButton onClick={() => window.history.back()} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{essayData.title}</h1>

        {(() => {
          if (userEssayData.status === "bought") {
            return (
              <BoughtEssayView
                userEssayData={userEssayData}
                deadline={deadline}
                setDeadline={setDeadline}
                noDeadline={noDeadline}
                setNoDeadline={setNoDeadline}
                isStartEnabled={noDeadline || Boolean(deadline)}
                onStartClick={() => {
                  startEssayMutation.mutate(
                    {
                      essay_id: userEssayData.id,
                      ...(noDeadline ? {} : { deadline }),
                    },
                    {
                      onSuccess: () => setStarted(true),
                    }
                  );
                }}
              />
            );
          } else if (
            userEssayData.status === "in_progress" ||
            userEssayData.status === "in_review"
          ) {
            return <InProgressEssayView userEssayData={userEssayData} />;
          } else {
            return <ReviewedEssayView userEssayData={userEssayData} />;
          }
        })()}
      </div>
    </>
  );
}

const BoughtEssayView = ({
  userEssayData,
  deadline,
  setDeadline,
  noDeadline,
  setNoDeadline,
  isStartEnabled,
  onStartClick,
}: {
  userEssayData: any;
  deadline: string;
  setDeadline: (d: string) => void;
  noDeadline: boolean;
  setNoDeadline: (v: boolean) => void;
  isStartEnabled: boolean;
  onStartClick: () => void;
}) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <span className={styles.fileName}>Текст появится после старта ({userEssayData.status})</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус:{" "}
        <span className={styles.statusBought}>не начато</span>
      </p>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Выберите дедлайн</h2>
      <input
        type="date"
        value={deadline}
        onChange={(e) => {
          setDeadline(e.target.value);
          setNoDeadline(false);
        }}
        min={new Date().toISOString().split("T")[0]}
        className={styles.dateInput}
      />
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={noDeadline}
          onChange={(e) => {
            setNoDeadline(e.target.checked);
            if (e.target.checked) {
              setDeadline("");
            }
          }}
        />
        Без дедлайна
      </label>
    </div>

    <div className={`${styles.complete} ${styles.animate}`}>
      <button
        className={styles.button}
        onClick={onStartClick}
        disabled={!isStartEnabled}
      >
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
        <a 
            href={userEssayData.download_essay_file_url}
            download="26.pdf" 
            >
        <span className={styles.fileName}>26.pdf</span>
        </a>
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Твое сочинение</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <span className={styles.fileName}>file.docx</span>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус:{" "}
        <span className={styles[`status${capitalizeFirstLetter(userEssayData.status)}`]}>
          {translateStatus(userEssayData.status)}
        </span>
      </p>
      <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
    </div>

    <div className={`${styles.complete} ${styles.animate}`}>
      <button className={styles.button}>Отправить решение</button>
    </div>
  </>
);

const ReviewedEssayView = ({ userEssayData }: { userEssayData: any }) => (
  <>
    <div className={styles.section}>
      <h2 className={styles.subtitle}>Текст сочинения</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <a 
            href={userEssayData.download_essay_file_url}
            download="26.pdf" 
            >
        <span className={styles.fileName}>26.pdf</span>
        </a>
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Твое сочинение</h2>
      <div className={styles.fileBox}>
        <FileEmoji size={25} />
        <a 
            href={userEssayData.download_user_file_url}
            download="26.pdf" 
            >
        <span className={styles.fileName}>file.docx</span>
        </a>
      </div>
    </div>

    <div className={styles.statusBlock}>
      <p>
        Статус:{" "}
        <span className={styles[`status${capitalizeFirstLetter(userEssayData.status)}`]}>
          {translateStatus(userEssayData.status)}
        </span>
      </p>
      <p>Твой дедлайн: {new Date(userEssayData.deadline).toLocaleDateString()}</p>
    </div>

    <div className={styles.section}>
      <h1 className={styles.subtitle}>Итоговый балл: 15/26</h1>
    </div>

    <div className={styles.section}>
      <h2 className={styles.subtitle}>Рецензия проверяющего</h2>
      <div className={styles.fileBox}>
        <p>
          Сочинение соответствует теме и строится на материале указанного произведения. Автор раскрывает проблему взаимоотношений отцов и детей на примере Печорина и Максима Максимыча в романе «Герой нашего времени». Приведены два аргумента: отношение Печорина к старому знакомому и его внутреннее одиночество. Однако анализ недостаточно глубок, выводы не всегда связаны с текстом. Стиль речи соответствует нормам, но наблюдаются отдельные нарушения в построении предложений. Оценка: 2 из 5.
        </p>
      </div>
    </div>
  </>
);

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

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function translateStatus(status: string) {
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
}

