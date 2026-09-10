import { useEffect } from "react";
import styles from "./ResultView.module.css";
import RewardStatusIcon from "./RewardStatusIcon";
import { playSound } from "./utils/audioEffects";
import { ShieldCheck } from "lucide-react";

export default function ResultView({ success = true, onClaim, onNoThanks }) {
  useEffect(() => {
    playSound(success ? "success" : "fail");
  }, [success]);

  const prefix = success ? "+1" : "+0.5";
  const subtitle = success
    ? "Full reward earned"
    : "Keep going. Your reward is still yours.";

  return (
    <div className={styles.container}>
      {/* Animated Gooey SVG Backdrop */}
      <div className={styles.gooyWrapper}>
        <img
          src="/assets/gooy.svg"
          alt="Gooey Background"
          className={styles.gooySvg}
        />
      </div>

      {/* Title */}
      <h2
        className={`${styles.title} ${styles.revealTitle} ${
          success ? styles.successTitle : styles.failTitle
        }`}
      >
        {success ? "Verification complete!" : "Verification unsuccessful!"}
      </h2>

      {/* Rotating Circles Icon */}
      <div className={styles.revealIcon}>
        <RewardStatusIcon success={success} />
      </div>

      {/* Reward Amount Display */}
      <div className={`${styles.rewardArea} ${styles.revealReward}`}>
        <div className={styles.gemAmountRow}>
          <img
            src="/assets/gem-gold.webp"
            alt="Gold Gem"
            className={styles.gemIcon}
          />
          <span className={styles.gemAmount}>
            <span className={styles.yellowPrefix}>{prefix}</span>{" "}
            <span className={styles.gemWord}>Gem</span>
          </span>
        </div>
        <p className={styles.rewardSubtitle}>{subtitle}</p>
      </div>

      {/* Action Buttons */}
      <div className={`${styles.actionsRow} ${styles.revealButtons}`}>
        <button className={styles.claimBtn} onClick={onClaim}>
          Claim
        </button>
        <button className={styles.noThanksBtn} onClick={onNoThanks}>
          No Thanks
        </button>
      </div>

      {/* Secure Reward Pill */}
      <div className={`${styles.securePill} ${styles.revealPill}`}>
        <span className={styles.securePillDot} />
        <ShieldCheck size={13} className={styles.securePillIcon} />
        <span className={styles.securePillText}>
          {success ? "Secure Reward Transfer" : "Safe & Encrypted Session"}
        </span>
      </div>
    </div>
  );
}
