import { useEffect, useState } from "react";
import styles from "./PreparingView.module.css";
import { playSound } from "./utils/audioEffects";

export default function PreparingView({ onReady }) {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    playSound("verify");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 60);

    const timer = setTimeout(() => {
      if (onReady) onReady();
    }, 1100);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onReady]);

  return (
    <div className={styles.container}>
      {/* Animated Gooey SVG Background */}
      <div className={styles.gooyWrapper}>
        <img
          src="/assets/gooy.svg"
          alt="Gooey Aura"
          className={styles.gooySvg}
        />
      </div>

      {/* Purple Gem */}
      <img
        src="/assets/gem-purple.png"
        alt="Preparing Gem"
        className={styles.gemIcon}
      />

      <h2 className={styles.statusTitle}>Preparing...</h2>

      {/* Concentric Circle Loader from Page 6 */}
      <div className={styles.spinnerArea}>
        <div className={styles.outerRing} />
        <div className={styles.innerRing} />
      </div>

      <p className={styles.waitNotice}>
        Please wait while we
        <br />
        prepare your reward.
      </p>

      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
