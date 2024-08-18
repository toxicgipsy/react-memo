import styles from "./ReserSimpleGameModal.module.css";

import { Button } from "../Button/Button";

// import deadImageUrl from "./images/dead.png";
// import celebrationImageUrl from "./images/celebration.png";
//import { useSimpleModeContext } from "../../context/hooks/useSimpleMode";

export function ReserSimpleGameModal({ gameDurationSeconds, gameDurationMinutes, onClick, countGame }) {
  //const { simpleMode } = useSimpleModeContext();

  // const title = isWon ? "Вы победили!" : "Вы проиграли!";

  // const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  // const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>Осталось попыток: {countGame}</h2>
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>
      <Button onClick={onClick}>Продолжить</Button>
    </div>
  );
}
