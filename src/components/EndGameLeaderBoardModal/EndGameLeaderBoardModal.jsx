import styles from "./EndGameLeaderBoardModal.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLeaders } from "../../utils/api";
import celebrationImageUrl from "../EndGameModal/images/celebration.png";
import { Button } from "../Button/Button";
import { useLeaderBoardContext } from "../../context/hooks/useLeaderBoard";
import { useSimpleModeContext } from "../../context/hooks/useSimpleMode";

export function EndGameLeaderBoardModal({ gameDurationMinutes, gameDurationSeconds, timeGame, resetGame }) {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState("");
  const [errorName, setErrorName] = useState(false);
  // Контекст лидерборда
  const { setLeaderList } = useLeaderBoardContext();
  // Контекст упрощенного режима
  const { simpleMode } = useSimpleModeContext();
  const addLeaderBoard = reset => {
    let achievements = [];
    if (!simpleMode) {
      achievements.push(1);
    }
    addLeaders({ name: nameInput, time: timeGame, achievements: achievements })
      .then(data => {
        setLeaderList(data.leaders.sort((a, b) => a.time - b.time).slice(0, 10));
        reset ? resetGame() : navigate("/leaderboard");
      })
      .catch(error => {
        setErrorName(true);
      });
  };
  return (
    <div className={styles.modal}>
      <img className={styles.image} src={celebrationImageUrl} alt={"celebration emodji"} />
      <h2 className={styles.title}>Вы попали на Лидерборд!</h2>
      <input
        className={styles.inputUser}
        type="text"
        placeholder="Пользователь"
        onChange={e => {
          setNameInput(e.target.value);
        }}
      />
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>
      <Button onClick={() => addLeaderBoard(true)}>Играть снова</Button>
      <div className={styles.goLeaderBoard} onClick={() => addLeaderBoard(false)}>
        Перейти к лидерборду
      </div>
      {errorName ? <span className={styles.errorName}>Заполни имя, чтобы продолжить</span> : null}
    </div>
  );
}
