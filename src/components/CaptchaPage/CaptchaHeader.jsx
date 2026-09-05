import React, { useEffect, useState } from 'react';
import styles from './CaptchaHeader.module.css';
import { Volume2, VolumeX } from 'lucide-react';
import { setSoundMuted, getSoundMuted } from './utils/audioEffects';

export default function CaptchaHeader({ gems = 125.50 }) {
  const [muted, setMuted] = useState(getSoundMuted());
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    setBumping(true);
    const t = setTimeout(() => setBumping(false), 600);
    return () => clearTimeout(t);
  }, [gems]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

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
          title={muted ? 'Unmute audio' : 'Mute audio'}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className={`${styles.gemBadge} ${bumping ? styles.bump : ''}`}>
          <img 
            src="/assets/gem-gold.png" 
            alt="Gold Gem" 
            className={styles.gemIcon}
          />
          <span className={styles.gemValue}>
            {typeof gems === 'number' ? gems.toFixed(2) : gems}
          </span>
        </div>
      </div>
    </header>
  );
}
