import { Link, useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useSimpleModeContext } from "../../context/hooks/useSimpleMode";
import { useState } from "react";

export function SelectLevelPage() {
  const { simpleMode, toggleSimpleMode } = useSimpleModeContext();
  // Храним выбранную сложность
  const [selectedLevel, setSelectedLevel] = useState(null);
  // Хук для навигации
  const navigate = useNavigate();

  const handlePlay = () => {
    if (selectedLevel !== null) {
      navigate(`/game/${selectedLevel}`);
    } else {
      alert("Выбери уровень сложности");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li
            className={`${styles.level} ${selectedLevel === 3 ? styles.selected : ""}`}
            onClick={() => setSelectedLevel(3)}
          >
            1
          </li>
          <li
            className={`${styles.level} ${selectedLevel === 6 ? styles.selected : ""}`}
            onClick={() => setSelectedLevel(6)}
          >
            2
          </li>
          <li
            className={`${styles.level} ${selectedLevel === 9 ? styles.selected : ""}`}
            onClick={() => setSelectedLevel(9)}
          >
            3
          </li>
        </ul>
        <div>
          <input type="checkbox" id="simpleMode" checked={simpleMode} onChange={toggleSimpleMode} />
          <label htmlFor="simpleMode">Легкий режим (3 жизни)</label>
        </div>
        <button className={styles.playButton} onClick={handlePlay}>
          Играть
        </button>
        <Link to="/leaderboard">
          <div className={styles.goLeaderBoard}>Перейти к лидерборду</div>
        </Link>
      </div>
    </div>
  );
}
