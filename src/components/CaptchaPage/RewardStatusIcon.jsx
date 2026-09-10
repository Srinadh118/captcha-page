import styles from "./RewardStatusIcon.module.css";

export default function RewardStatusIcon({ success }) {
  // Notice: public/assets/cross-red.svg contains the checkmark (#34C759)
  // and public/assets/right-green.svg contains the cross (#FF383C)
  const svgSrc = success
    ? "/assets/circle-green.svg"
    : "/assets/circle-red.svg";

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
      <div className={styles.svgContainer}>
        {success ? (
          <svg
            className={styles.tickSvgIcon}
            width="58"
            height="36"
            viewBox="0 0 58 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.00062 14.6608L21.4785 32.5156L55.2403 2.00014"
              stroke="#34C759"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            className={styles.crossSvgIcon}
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2L20.906 20.906M39.8121 2.00014L20.906 20.906M20.906 20.906L2 39.812M20.906 20.906L39.8121 39.812"
              stroke="#FF383C"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
