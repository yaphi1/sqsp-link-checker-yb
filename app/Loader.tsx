import styles from "./loader.module.css";

export function Loader({ phrases, secondsBetweenPhrases = 2 } : {
  phrases: Array<string>,
  secondsBetweenPhrases?: number,
}) {
  return (
    <div style={{ padding: '4px' }}>
      {phrases.map((phrase, index) => (
        <div
          key={phrase}
          className={styles.loading}
          style={{
            animationDelay: `${index * secondsBetweenPhrases}s`,
          }}
        >
          {phrase}
        </div>
      ))}
    </div>
  );
}
