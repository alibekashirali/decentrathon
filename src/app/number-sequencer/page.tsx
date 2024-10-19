// src/app/sequence-safari/page.tsx

"use client"; // Add this line to mark this file as a Client Component

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NumberSequencer() {
  const [sequence, setSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [message, setMessage] = useState('')
  const [level, setLevel] = useState(1)

  useEffect(() => {
    generateSequence()
  }, [level])

  const generateSequence = () => {
    const newSequence = Array.from({ length: level + 2 }, (_, i) => i + 1)
    setSequence(newSequence.sort(() => Math.random() - 0.5))
    setPlayerSequence([])
    setMessage('')
  }

  const handleNumberClick = (number) => {
    if (playerSequence.includes(number)) {
      setPlayerSequence(playerSequence.filter(item => item !== number))
    } else {
      setPlayerSequence([...playerSequence, number])
    }
  }

  const checkSequence = () => {
    const isCorrect = playerSequence.every((number, index) => number === index + 1)
    if (isCorrect) {
      setMessage('Correct! Moving to next level.')
      setLevel(level + 1)
    } else {
      setMessage('Not quite right. Try again!')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Number Sequencer</h1>
      <p className="mb-4">Arrange the numbers in ascending order. Current level: {level}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {sequence.map(number => (
          <Card 
            key={number} 
            className={`cursor-pointer ${playerSequence.includes(number) ? 'border-primary' : ''}`}
            onClick={() => handleNumberClick(number)}
          >
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{number}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={checkSequence} className="mb-4">Check Sequence</Button>
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  )
}