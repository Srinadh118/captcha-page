import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ChallengeView.module.css";
import { RotateCw } from "lucide-react";
import { playSound } from "./utils/audioEffects";

export default function ChallengeView({ challenge, onSelect, onRefresh }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cardRef = useRef(null);

  // Scramble / Matrix decode effect on challenge code change
  const targetCode = challenge?.code || "A7K2P9";
  const [displayCode, setDisplayCode] = useState(targetCode);
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let frame = 0;
    const maxFrames = 10;

    const timer = setTimeout(() => {
      setIsScrambling(true);
    }, 0);

    const interval = setInterval(() => {
      frame++;
      const progress = frame / maxFrames;
      const scrambled = targetCode
        .split("")
        .map((char, i) => {
          if (i / targetCode.length < progress) {
            return char;
          }
          return charset[Math.floor(Math.random() * charset.length)];
        })
        .join("");

      setDisplayCode(scrambled);

      if (frame >= maxFrames) {
        clearInterval(interval);
        setDisplayCode(targetCode);
        setIsScrambling(false);
      }
    }, 28);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetCode]);

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
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  const handleOptionClick = useCallback(
    (option) => {
      if (selectedOption || isExiting) return;
      setSelectedOption(option);
      playSound("click");

      // Trigger exit animation matching diagram (card left, staggered options right)
      setIsExiting(true);

      setTimeout(() => {
        onSelect(option);
      }, 450);
    },
    [selectedOption, isExiting, onSelect],
  );

  const handleRefreshClick = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (isExiting || isRefreshing) return;
      playSound("refresh");
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 450);

      if (onRefresh) onRefresh();
    },
    [isExiting, isRefreshing, onRefresh],
  );

  // Keyboard navigation: [1-4] or [A-D] selects option, [R] refreshes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedOption || isExiting) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      const options = challenge?.options || [
        "A7K2P9",
        "AJK29P",
        "AJL9P2",
        "X4M8Q1",
      ];

      if (e.key === "1" && options[0]) handleOptionClick(options[0]);
      else if (e.key === "2" && options[1]) handleOptionClick(options[1]);
      else if (e.key === "3" && options[2]) handleOptionClick(options[2]);
      else if (e.key === "4" && options[3]) handleOptionClick(options[3]);
      else if ((e.key === "a" || e.key === "A") && options[0])
        handleOptionClick(options[0]);
      else if ((e.key === "b" || e.key === "B") && options[1])
        handleOptionClick(options[1]);
      else if ((e.key === "c" || e.key === "C") && options[2])
        handleOptionClick(options[2]);
      else if ((e.key === "d" || e.key === "D") && options[3])
        handleOptionClick(options[3]);
      else if (e.key === "r" || e.key === "R") {
        handleRefreshClick(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    challenge,
    selectedOption,
    isExiting,
    handleOptionClick,
    handleRefreshClick,
  ]);

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
                "--shine-x": `${mousePos.x}%`,
                "--shine-y": `${mousePos.y}%`,
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Corner brackets */}
              <div className={styles.cornerTL} />
              <div className={styles.cornerBR} />

              {/* Dynamic mouse-following specular light shine */}
              <div className={styles.specularShine} />

              {/* Subtle ambient moving shimmer */}
              <div className={styles.shimmerOverlay} />

              {/* Laser scanline sweep */}
              <div className={styles.laserScanline} />

              {/* Top status bar inside card */}
              <div className={styles.cardTopBar}>
                <div className={styles.securityPill}>
                  <span className={styles.securityDot} />
                  <span className={styles.securityText}>AES-256 VERIFY</span>
                </div>

                <button
                  className={`${styles.refreshBtn} ${isRefreshing ? styles.refreshBtnSpinning : ""}`}
                  onClick={handleRefreshClick}
                  title="Generate new code (Press 'R')"
                  aria-label="Generate new code"
                >
                  <RotateCw size={14} className={styles.rotateIcon} />
                </button>
              </div>

              {/* Alphanumeric CAPTCHA text with character rendering */}
              <div
                className={`${styles.captchaCodeArea} ${isScrambling ? styles.scrambling : ""}`}
              >
                <span className={styles.captchaText}>
                  {displayCode.split("").map((ch, idx) => (
                    <span key={idx} className={styles.codeChar}>
                      {ch}
                    </span>
                  ))}
                </span>
              </div>

              {/* Card Footer Micro-tag */}
              <div className={styles.cardFooter}>
                <span className={styles.cardFooterText}>
                  VELOOP QUANTUM DEFENSE
                </span>
              </div>
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
              <span className={styles.tierTag}>+1.00 GEM</span>
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
                    onMouseEnter={() => playSound("hover")}
                    disabled={isExiting}
                    title={`Option ${idx + 1} (Press '${idx + 1}')`}
                  >
                    <span className={styles.keyBadge}>{idx + 1}</span>
                    <span className={styles.optionText}>{opt}</span>
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
        <div
          className={styles.rewardPill}
          title="Correct: +1.00 Gem • Attempt: +0.50 Gem"
        >
          <div className={styles.pillGemWrapper}>
            <img
              src="/assets/gem-gold.webp"
              alt="Gold Gem"
              className={styles.pillGem}
            />
            <div className={styles.gemAura} />
          </div>
          <div className={styles.pillTextGroup}>
            <span className={styles.pillTextLine1}>
              Complete verification to earn
            </span>
            <span className={styles.pillTextLine2}>+1 Gem</span>
          </div>
        </div>

        {/* Keyboard Quick Navigation Hint Bar */}
        <div className={styles.keyboardHints}>
          <span className={styles.hintItem}>
            <kbd className={styles.kbdKey}>1-4</kbd> Select
          </span>
          <span className={styles.hintDot}>•</span>
          <span className={styles.hintItem}>
            <kbd className={styles.kbdKey}>R</kbd> Refresh
          </span>
          <span className={styles.hintDot}>•</span>
          <span className={styles.hintItem}>
            <kbd className={styles.kbdKey}>M</kbd> Audio
          </span>
        </div>
      </div>
    </div>
  );
}
