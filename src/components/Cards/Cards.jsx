import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useSimpleModeContext } from "../../context/hooks/useSimpleMode";
import { getLeaders } from "../../utils/api";
import { EndGameLeaderBoardModal } from "../EndGameLeaderBoardModal/EndGameLeaderBoardModal";
import * as S from "../Cards/Cards.styled";
import { useEpiphanyContext } from "../../context/hooks/useEpiphany";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_LEADERBOARD_WON = "STATUS_LEADERBOARD_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  useEffect(() => {
    getLeaders()
      .then(data => {
        const leaderList = data.leaders.sort((a, b) => a.time - b.time).slice(0, 10);
        const leaderWithMaxTime = leaderList.reduce((acc, curr) => {
          return acc.time > curr.time ? acc : curr;
        }, {});
        setLastTime(leaderWithMaxTime.time);
        return;
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Получаем контекст упрощенного режима: включен он или нет
  const { simpleMode } = useSimpleModeContext();
  // Количество оставщихся попыток в упрощенном режиме
  const [countGame, setCountGame] = useState(3);
  // Получаем наихудший результат в лидерборде
  const [lastTime, setLastTime] = useState(null);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);
  // Стейт для паузы в игре
  const [isPause, setIsPause] = useState(false);
  // Получаем контекст прозрения: был включен он или нет
  const { isEpiphany, setIsEpiphany } = useEpiphanyContext();

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setIsEpiphany(false);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setIsEpiphany(false);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = async clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      if (pairsCount === 9) {
        const timeGame = timer.minutes * 60 + timer.seconds;
        if (timeGame < lastTime) {
          finishGame(STATUS_LEADERBOARD_WON);
          return;
        }
      }
      setCountGame(3);
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      if (simpleMode) {
        if (countGame > 1) {
          setTimeout(() => {
            openCardsWithoutPair.map(card => {
              card.open = false;
            });
          }, 500);
          setCountGame(countGame - 1);
          return;
        }
      }
      setCountGame(3);
      finishGame(STATUS_LOST);
      return;
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;
  const isGameEndedLeaderBoard = status === STATUS_LEADERBOARD_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    if (!isPause) {
      const intervalId = setInterval(() => {
        setTimer(getTimerValue(gameStartDate, gameEndDate));
      }, 200);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameStartDate, gameEndDate, isPause]);

  // Функция срабатывания паузы на 5 секунд
  const enablePause = () => {
    setIsPause(true);
    const openedCards = cards;
    setCards(
      cards.map(card => {
        return {
          ...card,
          open: true,
        };
      }),
    );
    setTimeout(() => {
      const newStartGame = new Date(gameStartDate.getTime() + 5000);
      setGameStartDate(newStartGame);
      setIsPause(false);
      setCards(openedCards);
      setIsEpiphany(true);
    }, 5000);
  };

  const timeGame = timer.minutes * 60 + timer.seconds;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <>
            <S.OpenAllCardsImages onClick={!isEpiphany ? enablePause : null} $isEpiphany={isEpiphany}>
              <svg width="68" height="68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="68" height="68" rx="34" fill="#C2F5FF" />
                <path
                  d="m6.064 35.27.001.003C11.817 45.196 22.56 51.389 34 51.389c11.44 0 22.183-6.13 27.935-16.117l.001-.002.498-.87.142-.249-.142-.248-.498-.871-.001-.003C56.183 23.106 45.44 16.913 34 16.913c-11.44 0-22.183 6.193-27.935 16.116l-.001.003-.498.871-.142.248.142.248.498.871Z"
                  fill="#fff"
                  stroke="#E4E4E4"
                />
                <mask id="a" maskUnits="userSpaceOnUse" x="6" y="17" width="56" height="34">
                  <path
                    d="M34 50.889c-11.262 0-21.84-6.098-27.502-15.867L6 34.152l.498-.872C12.16 23.511 22.738 17.413 34 17.413s21.84 6.098 27.502 15.867l.498.871-.498.871C55.84 44.853 45.262 50.89 34 50.89Z"
                    fill="#fff"
                  />
                </mask>
                <g mask="url(#a)">
                  <g filter="url(#b)">
                    <path
                      d="M34 50.889c-11.262 0-21.84-6.098-27.502-15.867L6 34.152l.498-.872C12.16 23.511 22.738 17.413 34 17.413s21.84 6.098 27.502 15.867l.498.871-.498.871C55.84 44.853 45.262 50.89 34 50.89Z"
                      fill="#fff"
                    />
                  </g>
                  <circle cx="34.311" cy="26.187" r="17.111" fill="url(#c)" />
                  <path
                    d="M39.29 26.373A5.284 5.284 0 0 1 34 21.084c0-1.057.311-2.115.871-2.924-.31-.062-.622-.062-.87-.062-4.605 0-8.276 3.733-8.276 8.275 0 4.605 3.733 8.276 8.275 8.276 4.605 0 8.276-3.733 8.276-8.276 0-.31 0-.622-.063-.87-.808.56-1.804.87-2.924.87Z"
                    fill="url(#d)"
                  />
                </g>
                <defs>
                  <linearGradient id="c" x1="34.311" y1="9.076" x2="34.311" y2="43.298" gradientUnits="userSpaceOnUse">
                    <stop />
                    <stop offset="1" />
                  </linearGradient>
                  <linearGradient id="d" x1="34" y1="18.098" x2="34" y2="34.649" gradientUnits="userSpaceOnUse">
                    <stop />
                    <stop offset="1" />
                  </linearGradient>
                  <filter id="b" x="6" y="17.413" width="60" height="35.476" filterUnits="userSpaceOnUse">
                    <feFlood result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix
                      in="SourceAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="4" dy="2" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                    <feBlend in2="shape" result="effect1_innerShadow_0_1" />
                  </filter>
                </defs>
              </svg>
            </S.OpenAllCardsImages>
            <Button countGame={simpleMode ? countGame : null} onClick={resetGame}>
              Начать заново
            </Button>
          </>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {!simpleMode ? null : <p>Осталось попыток: {countGame}</p>}

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}

      {isGameEndedLeaderBoard ? (
        <div className={styles.modalContainer}>
          <EndGameLeaderBoardModal
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            timeGame={timeGame}
            resetGame={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
