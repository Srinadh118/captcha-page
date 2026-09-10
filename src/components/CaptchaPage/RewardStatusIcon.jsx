import styles from "./RewardStatusIcon.module.css";

export default function RewardStatusIcon({ success }) {
  // Notice: public/assets/cross-red.svg contains the checkmark (#34C759)
  // and public/assets/right-green.svg contains the cross (#FF383C)
  const svgSrc = success ? "/assets/cross-red.svg" : "/assets/right-green.svg";

  return (
    <div className={styles.iconContainer}>
      {/* Outer rotating dashed ring with orbital dots */}
      <div
        className={`${styles.rotatingOuterRing} ${success ? styles.successOuter : styles.failOuter}`}
      >
        <div className={styles.orbitingDot1} />
        <div className={styles.orbitingDot2} />
      </div>

      {/* Counter-rotating inner dotted ring */}
      <div
        className={`${styles.rotatingInnerRing} ${success ? styles.successInner : styles.failInner}`}
      />

      {/* Center check or cross SVG */}
      <img
        src={svgSrc}
        alt={success ? "Verification Successful" : "Verification Unsuccessful"}
        className={`${styles.centerSvg} ${success ? styles.successGlow : styles.failGlow}`}
      />
    </div>
  );
}
