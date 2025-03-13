import React, { useEffect } from "react";
import { CoverScreen } from "./screens/CoverScreen";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Welcome.module.scss";
import { SignupScreen } from "./screens/SignupScreen";
import { OnbordingScreen } from "./screens/OnbordingScreen";
import { useCloudStorage, useWebApp } from "@/lib/twa/hooks";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { useNavigate } from "react-router-dom";
import { authTelegramMiniApp, login } from "@/services/auth";
import { LoaderSpinner } from "@repo/ui";
import posthog from "posthog-js";

export default function WelcomePage() {
  const webApp = useWebApp();
  const cloudStorage = useCloudStorage();

  const navigate = useNavigate();
  const [screen, setScreen] = React.useState(0);

  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    cloudStorage
      .getItem(ACCESS_TOKEN_NAME)
      .then((token) => {
        if (token.length > 1) {
          navigate("/home");
        }
      })
      .finally(() => setChecked(true));
  }, []);

  useEffect(() => {
    async function handleLogin() {
      try {
        const res = await authTelegramMiniApp({ query: webApp.initData });
        await login({
          token: res.token,
          userId: res.user.id,
        });
        posthog.capture("user_logged_in");
        navigate("/home");
      } catch (e) {
        setLoading(false);
      }
    }

    if (checked) {
      handleLogin();
    }
  }, [checked]);

  if (loading) {
    return (
      <div
        style={{
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoaderSpinner size={25} />
      </div>
    );
  }

  return (
    <motion.div
      className={styles.welcome}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{
        opacity: 1,
        filter: "blur(0)",
        transition: {
          delay: 0.2,
          duration: 1.6,
        },
      }}
    >
      <AnimatePresence>{screen === 0 && <CoverScreen onButtonClick={() => setScreen(1)} />}</AnimatePresence>
      <AnimatePresence>{screen === 1 && <SignupScreen onButtonClick={() => setScreen(2)} />}</AnimatePresence>
      <AnimatePresence>{screen === 2 && <OnbordingScreen />}</AnimatePresence>
    </motion.div>
  );
}
