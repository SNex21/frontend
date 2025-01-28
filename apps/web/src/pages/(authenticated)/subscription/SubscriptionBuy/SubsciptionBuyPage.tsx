import Telegram from '@twa-dev/sdk';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getPaymentUrl } from "@/services/api/subscriptions";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import styles from "./SubscriptionBuy.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";

export default function SubscriptionBuyPage() {
  const navigate = useNavigate();
  const params = useParams();
  const cloudStorage = useCloudStorage();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getPaymentUrl({
        token,
        plan_id: Number(params.planId),
        email,
      });
    },
    onSuccess: (paymentUrl) => {
      if (paymentUrl?.url) {
        Telegram.openLink(paymentUrl.url); // Редирект на полученный URL
      }
    },
    onError: (error) => {
      console.error("Failed to get payment URL", error);
    },
  });

  const handleEmailChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)); // Простая валидация email
  };

  const handleButtonClick = () => {
    if (isEmailValid) {
      mutate();
    }
  };

  return (
    <div className={styles.container}>
      <BackButton onClick={() => navigate("/account")} />
      <div className={styles.formContainer}>
        <label htmlFor="email" className={styles.label}>Для оплаты необходимо ввести email для отправки чека:</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={handleEmailChange}
          placeholder="example@gmail.com"
        />
      </div>
      <div className={styles.complete}>
        <button
          className={`${styles.button} ${!isEmailValid ? styles.buttonInactive : ""}`}
          onClick={handleButtonClick}
          disabled={!isEmailValid}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
