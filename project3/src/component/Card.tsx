export type CardProps = {
  card: string
  id: number
  isFlipped: boolean
  isMatched: boolean
  handleClick: (id: number) => void
}

const Card = ({ card, id, isFlipped, isMatched, handleClick }: CardProps) => {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={() => handleClick(id)}
      role="button"
      aria-label={`Card ${id + 1}`}
      aria-pressed={isFlipped || isMatched}
    >
      <div className="front-card">{card}</div>
      <div className="card-back">?</div>
    </div>
  )
}

export default Card
