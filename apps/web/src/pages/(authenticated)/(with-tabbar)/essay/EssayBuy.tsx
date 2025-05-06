import Telegram from '@twa-dev/sdk';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCloudStorage } from "@/lib/twa/hooks";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getEssayPaymentLink, checkTransaction } from "@/services/api/essays";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import styles from "./EssayBuy.module.scss";
import { BackButton } from "@/lib/twa/components/BackButton";
import Clock from "../../../assets/fonts/gifs/clock.gif";
import Confetti from "../../../assets/fonts/gifs/confetti.gif";

export default function EssayBuyPage() {
  const navigate = useNavigate();
  const params = useParams();
  const cloudStorage = useCloudStorage();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
      return getEssayPaymentLink({
        token,
        id : Number(params.essayId),
        email,
      });
    },
    onSuccess: (res) => {
      if (res?.link) {
        Telegram.openLink(res.link);
        setIsWaitingForPayment(true);
        startPolling(res.id);
      }
    },
    onError: (error) => {
      console.error("Failed to get essay payment URL", error);
    },
  });

  const handleEmailChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleButtonClick = () => {
    if (isEmailValid) {
      mutate();
    }
  };

  const handleConfirmationClick = () => {
    navigate(`/`);
  };

  const startPolling = (transactionId: string) => {
    let intervalId: NodeJS.Timeout;
  
    const pollTransaction = async () => {
      try {
        const token = await cloudStorage.getItem(ACCESS_TOKEN_NAME);
        const response = await checkTransaction({ token, id: transactionId });
  
        if (response?.status === "succeeded") {
          clearInterval(intervalId);
          setIsPaymentSuccessful(true);
        } else {
          clearInterval(intervalId);
          setIsWaitingForPayment(false);
          // Можно также добавить сообщение о неудачной оплате
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
      }
    };
  
    intervalId = setInterval(pollTransaction, 5000);
  
    setTimeout(() => {
      clearInterval(intervalId);
      setIsWaitingForPayment(false);
      // Здесь можно уведомить пользователя о таймауте
    }, 10 * 60 * 1000);
  };
  

  return (
    <div className={styles.container}>
      <BackButton onClick={() => navigate(`/essay/${params.essayId}`)} />
      {isPaymentSuccessful ? (
        <div className={styles.successContainer}>
          <div className={styles.emojiContainer}>
            <img src={Confetti} alt="Confetti" className={styles.confettiGif} />
          </div>
          <p className={styles.successMessage}>Оплата прошла успешно!</p>
          <div className={styles.complete}>
            <button
              className={styles.success_button}
              onClick={handleConfirmationClick}
            >
              К заданиям!
            </button>
          </div>
        </div>
      ) : isWaitingForPayment ? (
        <div className={styles.successContainer}>
          <div className={styles.emojiContainer}>
            <img src={Clock} alt="Clock" className={styles.clockGif} />
          </div>
          <p className={styles.successMessage}>Ожидаем оплату...</p>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <label htmlFor="email" className={styles.label}>
            Для оплаты необходимо ввести email для отправки чека:
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={handleEmailChange}
            placeholder="example@gmail.com"
          />
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
      )}
    </div>
  );
}
