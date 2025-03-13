import { useInitData } from "@/lib/twa/hooks";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../Welcome.module.scss";
import { Haptic } from "@/lib/twa/components/Haptic";
import { Avatar, AvatarFallback, AvatarImage, Button, LoaderSpinner } from "@repo/ui";
import cn from "classnames";
import { authTelegramMiniApp, checkUsername, login } from "@/services/auth";
import axios, { AxiosError, CancelTokenSource } from "axios";
import { ERROR_CODES } from "@/services/api/errors";
import debounce from "lodash/debounce";
import { CheckmarkCircleIcon, XmarkCircleIcon } from "@repo/ui/icons";
import { HuggingFaceEmoji } from "@repo/ui/emojis";
import posthog from "posthog-js";

interface SignUpScreenProps {
  onButtonClick: () => void;
}

const SignupScreen: FC<SignUpScreenProps> = ({ onButtonClick }) => {
  const [initDataUnsafe, initData] = useInitData();

  const [isFocused, setFocused] = useState(false);

  const [username, setUsername] = useState<string>(initDataUnsafe?.user?.username ?? "");
  const [status, setStatus] = useState<{
    success: boolean;
    error: null | string;
    loading: boolean;
  }>({ success: false, error: null, loading: false });

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const handleUsernameCheck = useCallback(
    debounce(async (name: string) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("New request initiated");
      }

      const newCancelToken = axios.CancelToken.source();
      cancelTokenRef.current = newCancelToken;

      try {
        setStatus((prev) => ({ ...prev, loading: true }));
        const res = await checkUsername({
          username: name,
          cancelToken: newCancelToken.token,
        });
        if (res.status === "ok") {
          setStatus({ success: true, error: null, loading: false });
        }
      } catch (e) {
        if (!axios.isCancel(e)) {
          const error = e as AxiosError;
          setStatus({
            success: false,
            error: getErrorMessage(error.response?.status),
            loading: false,
          });
        }
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    if (username) {
      handleUsernameCheck(username);
    } else {
      setStatus({ success: false, error: null, loading: false });
    }

    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Component unmounting");
      }
    };
  }, [username, handleUsernameCheck]);

  const handleLogin = useCallback(async () => {
    try {
      const res = await authTelegramMiniApp({
        query: initData ?? "",
        username,
        avatarUrl: "",
      });
      await login({ token: res.token, userId: res.user.id });
      posthog.capture("user_signed_up");
      
      // Вызов props вместо navigate
      onButtonClick();
    } catch (e) {
      const error = e as AxiosError;
      setStatus({
        success: false,
        error: getErrorMessage(error.response?.status),
        loading: false,
      });
    }
  }, [initData, username, setStatus, onButtonClick]);
  return (
    <motion.div
      className={styles.signup}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Анимация исчезновения фона
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.signup__title}
        initial={{
          opacity: 0,
          filter: "blur(10px)",
          transform: "translateY(50px)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0)",
          transform: "translateY(0)",
        }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <h1 className={cn(styles.title)}>
          Давай создадим
          <br />
          аккаунт
        </h1>
      </motion.div>

      <motion.div
        className={cn(styles.signup__content, {
          [styles.signup__content_expanded!]: isFocused,
        })}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        exit={{ y: 100, opacity: 0 }} // Уезжает вниз
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* ... (остальной код без изменений) */}

        <div className={styles.signup__button}>
          <Haptic type="impact" value="medium" event="onTouchStart" asChild>
            <Button disabled={!status.success} onClick={status.success ? handleLogin : undefined}>
              СОЗДАТЬ АККАУНТ
            </Button>
          </Haptic>
        </div>
      </motion.div>
    </motion.div>
  );
};
function getErrorMessage(code?: number) {
  switch (code) {
    case ERROR_CODES.INVALID_USERNAME:
      return "Это имя пользователя уже занято";
    case ERROR_CODES.USERNAME_NOT_AVAILABLE:
      return "Имя не подходит. Вы можете использовать символы a-z, 0-9 и подчеркивания. Длина от 5 до 32 символов";
    default:
      return "Произошла непредвиденная ошибка. Попробуйте перезапустить приложение или воспользуйтесь официальным клиентом Telegram";
  }
}

export { SignupScreen };
