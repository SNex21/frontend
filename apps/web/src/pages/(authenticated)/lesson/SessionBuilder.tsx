import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LessonHeader } from "@/pages/(authenticated)/lesson/LessonHeader";
import { Challenge, Guess, Session } from "@/models/Session";
import { ChallengeScreen } from "./Challenge";

import styles from "./Lesson.module.scss";

const defaultState = {
  regular: 0,
  wom: 0,
  hard: 0,
  localWom: 0,

  total: 0,
};

const HARD_TO_SOLVE = 0;
const WOM_TO_SOLVE = 0;

interface SessionBuilderProps {
  session: Session;
  stats: { total: number; completed: number; index: number };
  startDate: number;
  setStats: React.Dispatch<
    React.SetStateAction<{
      total: number;
      completed: number;
      correct: number;
      index: number;
    }>
  >;
  onComplete: ({ guesses }: { guesses: Guess[] }) => Promise<void>;
}

const SessionBuilder: React.FC<SessionBuilderProps> = ({ session, stats, startDate, setStats, onComplete }) => {
  const challenges = React.useRef(getChallenges(session.challenges));
  const guesses = React.useRef<Guess[]>([]);

  const [challengeScreens, setChallengeScreens] = React.useState<JSX.Element[]>([]);
  const [state, setState] = React.useState(defaultState);

  const getNextChallenge = React.useCallback(() => {
    const regular = challenges.current.regular.at(0);
    const localWom = challenges.current.localWom.at(0);
    const hard = challenges.current.hard.at(0);
    const wom = challenges.current.wom.at(0);

    const isEverMistaken = localWom || state.localWom > 0;

    if (state.regular + state.hard + state.wom >= session.amount) {
      if (localWom) return localWom;
      return undefined;
    }

    if (isEverMistaken && !regular && !localWom) {
      return undefined;
    }

    if (!isEverMistaken && !regular && !hard && !wom) {
      return undefined;
    }

    if (state.regular >= session.amount - HARD_TO_SOLVE - WOM_TO_SOLVE && (hard || wom)) {
      if (!isEverMistaken && hard && state.hard < HARD_TO_SOLVE) {
        return hard;
      }

      if (!isEverMistaken && wom && state.wom < WOM_TO_SOLVE) {
      // if (wom) {
        return wom;
      }
    }

    if (regular) {
      return regular;
    }

    // if (localWom) {
    //   return localWom;
    // }

    return regular;
  }, [challenges.current, state, session.amount]);

  const setNextChallenge = React.useCallback(async () => {
    const newChallenge = getNextChallenge();

    if (!newChallenge) {
      await onComplete({ guesses: guesses.current });
      return;
    }

    setStats((prevStats) => ({ ...prevStats, index: prevStats.index + 1 }));

    setChallengeScreens([
      <ChallengeScreen
        key={newChallenge.attempt ? `${newChallenge.id}-${newChallenge.attempt}` : newChallenge.id}
        challenge={newChallenge!}
        updateStats={updateStats}
        next={submit}
      />,
    ]);
  }, [getNextChallenge, setChallengeScreens, onComplete, guesses.current]);

  const updateStats = React.useCallback((isCorrect: boolean) => {
    setStats((prevStats) => ({
      total: prevStats.total, // убрал тут +1 при условии (тип это робит +1, когда чел неверно ответил, тип мы уверены, что он захочет свои ошибки прорешать)
      completed: prevStats.completed + 1,
      correct: isCorrect ? prevStats.correct + 1 : prevStats.correct,
      index: prevStats.index,
    }));
  }, []);

  const submit = React.useCallback(
    async (challenge: Challenge, isCorrect: boolean) => {
      if (isCorrect) {
        if (challenge.isLocalWom) {
          setState((prevState) => ({ ...prevState, localWom: prevState.localWom + 1 }));
          challenges.current.localWom = challenges.current.localWom.filter(
            (storedChallenge) => storedChallenge != challenge,
          );
        }
        if (challenge.isHard) {
          setState((prevState) => ({ ...prevState, hard: prevState.hard + 1 }));
          challenges.current.hard = challenges.current.regular.filter(
            (storedChallenge) => storedChallenge != challenge,
          );
        }
        if (challenge.isWorkOnMistakes) {
          setState((prevState) => ({ ...prevState, wom: prevState.wom + 1 }));
          challenges.current.wom = challenges.current.wom.filter((storedChallenge) => storedChallenge != challenge);
        }
        if (!challenge.isLocalWom && !challenge.isHard && !challenge.isWorkOnMistakes) {
          setState((prevState) => ({ ...prevState, regular: prevState.regular + 1 }));
          challenges.current.regular = challenges.current.regular.filter(
            (storedChallenge) => storedChallenge != challenge,
          );
        }
      } else {
        if (challenge.isLocalWom) {
          challenges.current.localWom = challenges.current.localWom.filter(
            (storedChallenge) => storedChallenge != challenge,
          );
        }
        if (challenge.isHard) {
          challenges.current.hard = challenges.current.regular.filter(
            (storedChallenge) => storedChallenge != challenge,
          );
        }
        if (challenge.isWorkOnMistakes) {
          challenges.current.wom = challenges.current.wom.filter((storedChallenge) => storedChallenge != challenge);
        }
        if (!challenge.isLocalWom && !challenge.isHard && !challenge.isWorkOnMistakes) {
          challenges.current.regular = challenges.current.regular.filter(
            (storedChallenge) => storedChallenge != challenge,
          );
        }
        challenges.current.localWom.push({
          ...challenge,
          isLocalWom: true,
          attempt: challenge.attempt ? challenge.attempt + 1 : 1,
        });
      }

      guesses.current.push({
        challengeId: challenge.id,
        correct: isCorrect,
      });

      await setNextChallenge();
    },
    [setNextChallenge, challenges.current, guesses.current],
  );

  React.useEffect(() => {
    setNextChallenge();
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, transform: "translateX(0)" }}
      exit={{ opacity: 0, transform: "translateX(-100%)", transition: { delay: 0.6 } }}
      className={styles.lesson}
    >
      <LessonHeader stats={stats} session={session.id, startDate, guesses.current} />
      <AnimatePresence>{challengeScreens.map((challenge) => challenge)}</AnimatePresence>
    </motion.div>
  );
};

function getChallenges(challenges: Challenge[]): {
  regular: Challenge[];
  hard: Challenge[];
  wom: Challenge[];
  localWom: Challenge[];
} {
  const regular: Challenge[] = [];
  const hard: Challenge[] = [];
  const wom: Challenge[] = [];

  challenges.forEach((challenge) => {
    if (challenge.isWorkOnMistakes) {
      return wom.push(challenge);
    }
    if (challenge.isHard) {
      return hard.push(challenge);
    }
    return regular.push(challenge);
  });

  return {
    regular,
    hard,
    wom,
    localWom: [],
  };
}

export { SessionBuilder };
