import { useEffect, useState } from "react";
import styles from "./VerifyingView.module.css";
import { playSound } from "./utils/audioEffects";
import { BadgeCheck, GlobeLock, ShieldLock } from "lucide-react";

export default function VerifyingView({ onComplete }) {
  const [phase, setPhase] = useState("verifying"); // 'verifying' -> 500ms -> 'checking'
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    playSound("verify");

    // 500ms transition to checking phase as specified in prompt
    const checkTimer = setTimeout(() => {
      setPhase("checking");
    }, 500);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 6;
      });
    }, 60);

    // Complete verification after ~1200ms
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1250);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(completeTimer);
      clearInterval(interval);
    };
  }, [onComplete]);

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
        src="/assets/gem-purple.webp"
        alt="Verifying Gem"
        className={styles.gemIcon}
      />

      {/* Dynamic Status Text: Verifying... -> Checking... */}
      <h2 className={styles.statusTitle}>
        {phase === "verifying" ? "Verifying..." : "Checking..."}
      </h2>

      {/* Orbital Ring with Lock Icon */}
      <div className={styles.spinnerArea}>
        <div className={styles.outerRing}>
          <div className={styles.orbitDot} />
        </div>
        <div className={styles.innerRing} />
        <img
          src="/assets/lock.png"
          alt="Security Lock"
          className={styles.lockIcon}
        />
      </div>

      <p className={styles.waitNotice}>
        Please wait while we
        <br />
        Check your answer.
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
