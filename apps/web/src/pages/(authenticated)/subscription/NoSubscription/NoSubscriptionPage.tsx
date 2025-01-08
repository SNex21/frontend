import React, { useState } from "react";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Link } from "react-router-dom";
import styles from "./NoSubscribe.module.scss";
import cn from "classnames";
import { BackButton } from "@/lib/twa/components/BackButton";
import { useNavigate } from "react-router-dom";
import { useCloudStorage } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionInfo, getSubscriptionPlans } from "@/services/api/subscriptions";
import { Skeleton } from "@repo/ui";

interface NoSubscriptionCardProps {
  title: string;
  description?: string;
}

interface PlanSubscriptionCardProps {
  title: string;
  description?: string;
  price: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const NoSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const cloudStorage = useCloudStorage();

  const { data: subscription, isLoading: isLoadingSubInfo } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () =>
      getSubscriptionInfo({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  const { data, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: async () =>
      getSubscriptionPlans({
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  if (isLoadingSubInfo || isLoadingPlans || !subscription || !data) {
    return <SubscriptionSectionLoading />;
  }

  const handleBuyClick = () => {
    if (selectedPlanId) {
      navigate(`/subscription/${selectedPlanId}`);
    }
  };

  return (
    <div>
      <BackButton onClick={() => navigate("/account")} />
      <section className={cn("wrapper", styles.section)}>
        <h2 className={styles.section__heading}>Подписка</h2>
        <NoSubscriptionCard
          title="У тебя пока нет подписки"
          description="Открывай доступ ко всем заданиям с подпиской!"
        />
      </section>

      <section className={cn("wrapper", styles.section__headings)}>
        <h2 className={styles.section__subheading}>Выбери свою подписку!</h2>
        <h5 className={styles.section__clue}>Нажми на подписку, чтобы купить её</h5>
      </section>

      <section className={cn("wrapper", styles.section)}>
        {data.map((plan) => (
          <PlanSubscriptionCard
            key={plan.id}
            title={plan.title}
            description={plan.description}
            price={plan.price}
            isSelected={selectedPlanId === plan.id}
            onSelect={() => setSelectedPlanId(plan.id)}
          />
        ))}
        <div className={styles.complete}>
          <button
            className={cn(styles.button, {
              [styles["button--inactive"]]: !selectedPlanId,
            })}
            onClick={handleBuyClick}
            disabled={!selectedPlanId}
          >
            Купить
          </button>
      </div>
      </section>
    </div>
  );
};

const NoSubscriptionCard: React.FC<NoSubscriptionCardProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <Haptic type="impact" value="medium" asChild>
        <div className={styles.info_card}>
          <div className={styles.info_card__content}>
            <h3 className={styles.info_card__content__title}>{title}</h3>
            {description && (
              <p className={styles.info_card__content__description}>
                {description}
              </p>
            )}
          </div>
        </div>
      </Haptic>
    </div>
  );
};

const PlanSubscriptionCard: React.FC<PlanSubscriptionCardProps> = ({
  title,
  description,
  price,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(styles.subscription_card, {
        [styles.subscription_card_selected]: isSelected,
      })}
    >
      
      <div className={styles.subscription_card__content}>
        <h3 className={styles.subscription_card__content__title}>{title}</h3>
        {false && (
          <p className={styles.subscription_card__content__description}>
            {description}
          </p>
        )}
        {price && (
          <p className={styles.subscription_card__content__description}>
            {price} руб.
          </p>
        )}
      </div>
    </div>
  );
};

const SubscriptionSectionLoading = () => (
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
