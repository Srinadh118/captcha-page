import React, { useState } from 'react';
import styles from './CaptchaPage.module.css';
import CaptchaHeader from './CaptchaHeader';
import ChallengeView from './ChallengeView';
import VerifyingView from './VerifyingView';
import ResultView from './ResultView';
import PreparingView from './PreparingView';
import MockAdModal from './MockAdModal';
import { generateCaptchaChallenge, PRESET_CHALLENGES } from './utils/captchaGenerator';

export default function CaptchaPage({ 
  initialGems = 125.50, 
  onComplete,
  onGemsUpdate 
}) {
  const [gems, setGems] = useState(initialGems);
  // Flow states: 'challenge' -> 'verifying' -> 'result' -> 'preparing' -> 'mock_ad'
  const [flowState, setFlowState] = useState('challenge');
  const [challenge, setChallenge] = useState(PRESET_CHALLENGES[0]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSuccess, setIsSuccess] = useState(true);

  // Refresh current challenge
  const handleRefreshChallenge = () => {
    setChallenge(generateCaptchaChallenge());
  };

  // Step 1: User selects an option in ChallengeView
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setFlowState('verifying');
  };

  // Step 2: Verification animation (Verifying -> 500ms Checking) completes
  const handleVerificationDone = () => {
    const success = selectedOption === challenge.code;
    setIsSuccess(success);
    setFlowState('result');

    if (onComplete) {
      onComplete({ success, selectedOption, correctCode: challenge.code });
    }
  };

  // Step 3A: User clicks "No Thanks" on Result screen -> Directly new CAPTCHA
  const handleNoThanks = () => {
    setChallenge(generateCaptchaChallenge());
    setSelectedOption(null);
    setFlowState('challenge');
  };

  // Step 3B: User clicks "Claim" on Result screen -> Preparing screen
  const handleClaim = () => {
    setFlowState('preparing');
  };

  // Step 4: Preparing reward animation finishes -> Show Mock Ad
  const handlePreparingDone = () => {
    setFlowState('mock_ad');
  };

  // Step 5: User collects reward in Mock Ad -> Increment gems & new CAPTCHA
  const handleAdClaimReward = () => {
    const earned = isSuccess ? 1.00 : 0.50;
    const newGems = +(gems + earned).toFixed(2);
    setGems(newGems);

    if (onGemsUpdate) {
      onGemsUpdate(newGems);
    }

    setTimeout(() => {
      setChallenge(generateCaptchaChallenge());
      setSelectedOption(null);
      setFlowState('challenge');
    }, 600);
  };

  // Step 5 alternative: User skips Mock Ad
  const handleAdSkip = () => {
    setChallenge(generateCaptchaChallenge());
    setSelectedOption(null);
    setFlowState('challenge');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Background with glowing light filaments & CAPTCHA watermark */}
      <div className={styles.bgLayer} />
      <div className={styles.ambientGlow} />

      {/* Header with VELoop REWARDS brand and live Gem counter */}
      <CaptchaHeader gems={gems} />

      {/* Main Flow Controller */}
      <main className={styles.contentContainer}>
        {flowState === 'challenge' && (
          <ChallengeView
            challenge={challenge}
            onSelect={handleSelectOption}
            onRefresh={handleRefreshChallenge}
          />
        )}

        {flowState === 'verifying' && (
          <VerifyingView onComplete={handleVerificationDone} />
        )}

        {flowState === 'result' && (
          <ResultView
            success={isSuccess}
            onClaim={handleClaim}
            onNoThanks={handleNoThanks}
          />
        )}

        {flowState === 'preparing' && (
          <PreparingView onReady={handlePreparingDone} />
        )}

        {flowState === 'mock_ad' && (
          <MockAdModal
            rewardAmount={isSuccess ? 1 : 0.5}
            onClaimReward={handleAdClaimReward}
            onSkip={handleAdSkip}
          />
        )}
      </main>
    </div>
  );
}
