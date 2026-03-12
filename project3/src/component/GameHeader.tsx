import type { FC } from 'react'

type GameHeaderProps = {
  score: number
  moves: number
  onReset: () => void
}

const GameHeader: FC<GameHeaderProps> = ({ score, moves, onReset }) => {
  return (
    <header className="game-header">
      <h1 className="title">Memory Card Game</h1>
      <div className="header-stats">
        <div className="stat-chip">
          <span className="stateLabel">Score</span>
          <span className="stateValue">{score}</span>
        </div>
        <div className="stat-chip">
          <span className="stateLabel">Moves</span>
          <span className="stateValue">{moves}</span>
        </div>
      </div>
      <button className="reset-btn" type="button" onClick={onReset}>
        New Game
      </button>
    </header>
  )
}

export default GameHeader
