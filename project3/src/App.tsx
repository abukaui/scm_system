import './App.css'
import { useMemo, useState } from 'react'
import GameHeader from './component/GameHeader'
import Card, { type CardProps } from './component/Card'

type GameCard = Omit<CardProps, 'handleClick'>

const cardFaces = [
  '\u{1F34E}', // apple
  '\u{1F34C}', // banana
  '\u{1F347}', // grape
  '\u{1F353}', // strawberry
  '\u{1F349}', // watermelon
  '\u{1F34D}', // pineapple
  '\u{1F96D}', // mango
  '\u{1F352}', // cherry
]

const createShuffledDeck = (): GameCard[] => {
  const doubled = [...cardFaces, ...cardFaces]

  return doubled
    .sort(() => Math.random() - 0.5)
    .map((card, id) => ({
      id,
      card,
      isFlipped: false,
      isMatched: false,
    }))
}

const App = () => {
  const [cards, setCards] = useState<GameCard[]>(() => createShuffledDeck())
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
 
  const matchedCount = useMemo(
    () => cards.filter((card) => card.isMatched).length,
    [cards],
  )
  const score = matchedCount / 2
  const isWin = matchedCount === cards.length && cards.length > 0

  const resetGame = () => {
    setCards(createShuffledDeck())
    setFlippedIds([])
    setMoves(0)
    setIsLocked(false)
  }

  const handleCardClick = (id: number) => {
    if (isLocked) {
      return
    }

    const clickedCard = cards.find((card) => card.id === id)
    
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) {
      return
    }

    const nextFlippedIds = [...flippedIds, id]

    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card,
      ),
    )

    if (nextFlippedIds.length < 2) {
      setFlippedIds(nextFlippedIds)
      return
    }

    const [firstId, secondId] = nextFlippedIds
    const firstCard = cards.find((card) => card.id === firstId)
    const secondCard = cards.find((card) => card.id === secondId)

    if (!firstCard || !secondCard) {
      setFlippedIds([])
      return
    }

    setMoves((currentMoves) => currentMoves + 1)

    if (firstCard.card === secondCard.card) {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card,
        ),
      )
      setFlippedIds([])
      return
    }

    setFlippedIds(nextFlippedIds)
    setIsLocked(true)

    window.setTimeout(() => {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isFlipped: false }
            : card,
        ),
      )
      setFlippedIds([])
      setIsLocked(false)
    }, 650)
  }

  return (
    <div className="app">
      <GameHeader score={score} moves={moves} onReset={resetGame} />
      {isWin ? (
        <p className="win-text">You matched all pairs in {moves} moves.</p>
      ) : null}
      <div className="board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            card={card.card}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            handleClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  )
}

export default App
