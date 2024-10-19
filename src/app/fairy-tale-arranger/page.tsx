// src/app/sequence-safari/page.tsx

"use client"; // Add this line to mark this file as a Client Component

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shuffle } from 'lucide-react'

export default function FairyTaleArranger() {
  const [story, setStory] = useState([
    { id: 1, text: "Once upon a time, there was a girl named Little Red Riding Hood." },
    { id: 2, text: "Her mother asked her to take food to her sick grandmother." },
    { id: 3, text: "On the way, she met a wolf who tricked her." },
    { id: 4, text: "The wolf ran ahead to grandmother's house." },
    { id: 5, text: "Little Red Riding Hood arrived and noticed something was wrong." },
    { id: 6, text: "A woodcutter came and saved Little Red Riding Hood and her grandmother." }
  ])
  const [playerSequence, setPlayerSequence] = useState([])
  const [message, setMessage] = useState('')

  const shuffleStory = () => {
    setStory([...story].sort(() => Math.random() - 0.5))
    setPlayerSequence([])
    setMessage('')
  }

  const handleCardClick = (card) => {
    if (playerSequence.includes(card)) {
      setPlayerSequence(playerSequence.filter(item => item.id !== card.id))
    } else {
      setPlayerSequence([...playerSequence, card])
    }
  }

  const checkSequence = () => {
    const isCorrect = playerSequence.every((card, index) => card.id === index + 1)
    setMessage(isCorrect ? "Correct! You've arranged the story perfectly!" : "Not quite right. Try rearranging the events.")
  }
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fairy Tale Arranger</h1>
      <p className="mb-4">Arrange the events of Little Red Riding Hood in the correct order.</p>
      <div className="space-y-2 mb-4">
        {story.map(card => (
          <Card 
            key={card.id} 
            className={`cursor-pointer ${playerSequence.includes(card) ? 'border-primary' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <CardContent className="p-4">
              <p>{card.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={checkSequence}>Check Sequence</Button>
        <Button onClick={shuffleStory} variant="outline">
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle
        </Button>
      </div>
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  )
}