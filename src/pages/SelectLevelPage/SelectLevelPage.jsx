import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useSimpleModeContext } from "../../context/hooks/useSimpleMode";

export function SelectLevelPage() {
  const { simpleMode, toggleSimpleMode } = useSimpleModeContext();
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div>
          <input type="checkbox" id="simpleMode" checked={simpleMode} onChange={toggleSimpleMode} />
          <label htmlFor="simpleMode">Легкий режим (3 жизни)</label>
          <Link to="/leaderboard">
            <div className={styles.goLeaderBoard}>Перейти к лидерборду</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
