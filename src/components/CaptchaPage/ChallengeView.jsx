import { useState, useRef } from "react";
import styles from "./ChallengeView.module.css";
import { RotateCw } from "lucide-react";
import { playSound } from "./utils/audioEffects";

export default function ChallengeView({ challenge, onSelect, onRefresh }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current || isExiting) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setCardTilt({ x: rotateX, y: rotateY });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const handleOptionClick = (option, index) => {
    if (selectedOption || isExiting) return;
    setSelectedOption(option);
    playSound("click");

    // Trigger exit animation matching diagram (card left, staggered options right)
    setIsExiting(true);

    setTimeout(() => {
      onSelect(option);
    }, 450);
  };

  const handleRefreshClick = (e) => {
    e.stopPropagation();
    if (isExiting) return;
    playSound("click");
    if (onRefresh) onRefresh();
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainRow}>
        {/* LEFT: Captcha Card (Enters from Left, Exits Left on select) */}
        <div className={styles.cardSide}>
          <div
            className={`${styles.cardWrapper} ${isExiting ? styles.cardExiting : styles.cardEntering}`}
          >
            <div
              ref={cardRef}
              className={styles.captchaCard}
              style={{
                transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.cornerTL} />
              <div className={styles.cornerBR} />
              <div className={styles.shimmerOverlay} />

              <button
                className={styles.refreshBtn}
                onClick={handleRefreshClick}
                title="Get new code"
                aria-label="Get new code"
              >
                <RotateCw size={15} className={styles.rotateIcon} />
              </button>

              <span className={styles.captchaText}>
                {challenge?.code || "A7K2P9"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Texts (Enters from Right, Exits Right on select) */}
        <div className={styles.contentSide}>
          <div
            className={`${styles.headerText} ${isExiting ? styles.headerTextExiting : styles.headerTextEntering}`}
          >
            <span className={styles.badgeTag}>
              <span className={styles.tagDot} />
              VERIFICATION CHALLENGE
            </span>
            <h2 className={styles.heading}>
              Earn<span className={styles.headingHighlight}>Gems</span>
            </h2>
            <p className={styles.description}>
              Complete a quick security check to earn rewards.
            </p>
          </div>
        </div>

        <div className={styles.optionsContainer}>
          {/* Instruction text - sits above options grid */}
          <p
            className={`${styles.instructionText} ${isExiting ? styles.headerTextExiting : styles.headerTextEntering}`}
          >
            Identify and select the code shown in the panel.
          </p>

          {/* Options grid - Staggered 2x2 Options - below captcha card */}
          <div className={styles.optionsGrid}>
            {(
              challenge?.options || ["A7K2P9", "AJK29P", "AJL9P2", "X4M8Q1"]
            ).map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const animClass = isExiting
                ? styles[`option${idx + 1}Exiting`]
                : styles[`option${idx + 1}Entering`];

              return (
                <div
                  key={`${opt}-${idx}`}
                  className={`${styles.optionItem} ${animClass}`}
                >
                  <button
                    className={`${styles.optionBtn} ${isSelected ? styles.selected : ""}`}
                    onClick={() => handleOptionClick(opt, idx)}
                    disabled={isExiting}
                  >
                    {opt}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM INCENTIVE PILL (2 lines) - Enters from Bottom */}
      <div
        className={`${styles.bottomPillWrapper} ${isExiting ? styles.bottomPillExiting : styles.bottomPillEntering}`}
      >
        <div className={styles.rewardPill}>
          <img
            src="/assets/gem-gold.webp"
            alt="Gold Gem"
            className={styles.pillGem}
          />
          <div className={styles.pillTextGroup}>
            <span className={styles.pillTextLine1}>
              Complete verification to earn
            </span>
            <span className={styles.pillTextLine2}>+1 Gem</span>
          </div>
        </div>
      </div>
    </div>
  );
}
