import { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { SimpleModeContext } from "../../context/SimpleModeContext";

export function SelectLevelPage() {
  const { simpleMode, toggleSimpleMode } = useContext(SimpleModeContext);
  console.log(simpleMode);
  console.log(toggleSimpleMode);
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
          <input type="checkbox" checked={simpleMode} onChange={toggleSimpleMode} />
          <label htmlFor="simpleMode">Включить легкий режим</label>
        </div>
      </div>
    </div>
  );
}
