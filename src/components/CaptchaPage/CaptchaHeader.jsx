import { useState, useEffect, useCallback } from "react";
import styles from "./CaptchaHeader.module.css";
import { Volume2, VolumeX } from "lucide-react";
import { setSoundMuted, getSoundMuted, playSound } from "./utils/audioEffects";

export default function CaptchaHeader({ gems = 125.5 }) {
  const [muted, setMuted] = useState(getSoundMuted());
  const [prevGems, setPrevGems] = useState(gems);
  const [bumpKey, setBumpKey] = useState(0);

  if (prevGems !== gems) {
    setPrevGems(gems);
    setBumpKey((k) => k + 1);
  }

  const toggleSound = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      setSoundMuted(next);
      if (!next) {
        playSound("click");
      }
      return next;
    });
  }, []);

  // Keyboard shortcut: Press 'M' to toggle sound
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "m" || e.key === "M") {
        toggleSound();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSound]);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1 className={styles.brandName}>
          VEL<span>oop</span>
        </h1>
        <span className={styles.brandSubtitle}>REWARDS</span>
      </div>

      <div className={styles.rightControls}>
        <button
          className={styles.soundBtn}
          onClick={toggleSound}
          title={muted ? "Unmute audio (Press 'M')" : "Mute audio (Press 'M')"}
          aria-label={muted ? "Unmute audio" : "Mute audio"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div key={bumpKey} className={`${styles.gemBadge} ${styles.bump}`}>
          <img
            src="/assets/gem-gold.webp"
            alt="Gold Gem"
            className={styles.gemIcon}
          />
          <span className={styles.gemValue}>
            {typeof gems === "number" ? gems.toFixed(2) : gems}
          </span>
        </div>
      </div>
    </header>
  );
}
