import { useEffect, useState } from "react";
import styles from "./PreparingView.module.css";
import { playSound } from "./utils/audioEffects";
import { BadgeCheck, GlobeLock, ShieldLock } from "lucide-react";

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
        <img
          src="/assets/gear-icon.png"
          alt="Gear icon"
          className={styles.gearIcon}
        />
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

      {/* Security Badges Row */}
      <div className={styles.securityBadges}>
        <span className={styles.badge}>
          <span className={styles.badgeIcon}>
            <GlobeLock size={16} />
          </span>
          <span className={styles.badgeLabel}>Encrypted</span>
        </span>
        <span className={styles.badgeDivider} />
        <span className={styles.badge}>
          <span className={styles.badgeIcon}>
            <ShieldLock size={16} />
          </span>
          <span className={styles.badgeLabel}>Protected</span>
        </span>
        <span className={styles.badgeDivider} />
        <span className={styles.badge}>
          <span className={`${styles.badgeIcon} ${styles.checkIcon}`}>
            <BadgeCheck size={16} />
          </span>
          <span className={styles.badgeLabel}>Verified</span>
        </span>
      </div>

      {/* Secure Pill Footer */}
      <div className={styles.securePill}>
        <span className={styles.securePillDot} />
        <span className={styles.securePillText}>
          Secure &amp; Verified Connection
        </span>
      </div>
    </div>
  );
}
