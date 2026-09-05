import React, { useState, useRef } from 'react';
import styles from './ChallengeView.module.css';
import { RotateCw } from 'lucide-react';
import { playSound } from './utils/audioEffects';

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
    playSound('click');

    // Trigger exit animation matching user specification (card left, staggered options right)
    setIsExiting(true);

    setTimeout(() => {
      onSelect(option);
    }, 450);
  };

  const handleRefreshClick = (e) => {
    e.stopPropagation();
    if (isExiting) return;
    playSound('click');
    if (onRefresh) onRefresh();
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainRow}>
        {/* LEFT: Captcha Card (Exits Left on select) */}
        <div 
          className={`${styles.cardWrapper} ${isExiting ? styles.cardExiting : ''}`}
          style={{
            transform: !isExiting ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)` : undefined
          }}
        >
          <div 
            ref={cardRef}
            className={styles.captchaCard}
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
              <RotateCw size={15} />
            </button>

            <span className={styles.captchaText}>
              {challenge?.code || 'A7K2P9'}
            </span>
          </div>
        </div>

        {/* RIGHT: Texts and Staggered 2x2 Options (Exit Right on select) */}
        <div className={styles.contentSide}>
          <div className={`${styles.headerText} ${isExiting ? styles.headerTextExiting : ''}`}>
            <span className={styles.badgeTag}>
              <span className={styles.tagDot} />
              VERIFICATION CHALLENGE
            </span>
            <h2 className={styles.heading}>Earn Gems</h2>
            <p className={styles.description}>
              Complete a quick security check to earn rewards. Identify and select the code shown in the panel.
            </p>
          </div>

          <div className={styles.optionsGrid}>
            {(challenge?.options || ['A7K2P9', 'AJK29P', 'AJL9P2', 'X4M8Q1']).map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const exitClass = isExiting ? styles[`option${idx + 1}Exiting`] : '';

              return (
                <div 
                  key={`${opt}-${idx}`} 
                  className={`${styles.optionItem} ${exitClass}`}
                >
                  <button
                    className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
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

      {/* BOTTOM INCENTIVE PILL */}
      <div className={`${styles.bottomPillWrapper} ${isExiting ? styles.bottomPillExiting : ''}`}>
        <div className={styles.rewardPill}>
          <img 
            src="/assets/gem-gold.png" 
            alt="Gold Gem" 
            className={styles.pillGem} 
          />
          <span className={styles.pillText}>
            Complete verification to earn <strong>+1 Gem</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
