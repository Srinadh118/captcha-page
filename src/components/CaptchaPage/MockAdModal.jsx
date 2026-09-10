import { useEffect, useState } from "react";
import styles from "./MockAdModal.module.css";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { playSound } from "./utils/audioEffects";

export default function MockAdModal({
  rewardAmount = 1,
  onClaimReward,
  onSkip,
}) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#facc15", "#ffffff", "#38bdf8"],
      });
    } catch (e) {
      // safe fallback
      console.log("confetti failed! anyways congratulations 🎉", e);
    }

    playSound("gem");
    if (onClaimReward) onClaimReward();
  };

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

      <div className={styles.adCard}>
        <div className={styles.adTopBar}>
          <span className={styles.sponsorTag}>Featured Partner</span>
          <button className={styles.skipBtn} onClick={onSkip}>
            {countdown > 0 ? `Skip in ${countdown}s` : "Skip Reward"}
          </button>
        </div>

        <div className={styles.adHero}>
          <div className={styles.adBadgeIcon}>
            <Zap size={28} color="#ffffff" />
          </div>

          <h3 className={styles.adTitle}>VELoop Nitro Pass</h3>
          <p className={styles.adDesc}>
            Unlock 2x Gem Multiplier on all daily verification challenges and
            instant rewards!
          </p>
        </div>

        <div className={styles.rewardBanner}>
          <img
            src="/assets/gem-gold.png"
            alt="Gold Gem"
            className={styles.gemIcon}
          />
          <span className={styles.rewardNotice}>
            Claim your +{rewardAmount} Gem reward now!
          </span>
        </div>

        <button className={styles.claimRewardBtn} onClick={handleClaim}>
          <Sparkles size={18} />
          <span>Collect Reward & Continue</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
