// src/app/sequence-safari/page.tsx

"use client"; // Add this line to mark this file as a Client Component

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shuffle } from 'lucide-react';

export default function SequenceSafari() {
  const [sequence, setSequence] = useState([
    { id: 1, animal: '🐘', stage: 'Baby' },
    { id: 2, animal: '🐘', stage: 'Child' },
    { id: 3, animal: '🐘', stage: 'Teen' },
    { id: 4, animal: '🐘', stage: 'Adult' },
  ]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [message, setMessage] = useState('');

  const shuffleSequence = () => {
    setSequence([...sequence].sort(() => Math.random() - 0.5));
    setPlayerSequence([]);
    setMessage('');
  };

  const handleCardClick = (card) => {
    if (playerSequence.includes(card)) {
      setPlayerSequence(playerSequence.filter(item => item.id !== card.id));
    } else {
      setPlayerSequence([...playerSequence, card]);
    }
  };

  const checkSequence = () => {
    const isCorrect = playerSequence.length === sequence.length &&
      playerSequence.every((card, index) => card.id === sequence[index].id);
    setMessage(isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sequence Safari</h1>
      <p className="mb-4">Arrange the elephant's life stages in the correct order.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {sequence.map(card => (
          <Card 
            key={card.id} 
            className={`cursor-pointer ${playerSequence.includes(card) ? 'border-primary' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <CardContent className="p-4">
              <div className="text-4xl">{card.animal}</div>
              <div className="text-sm">{card.stage}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={checkSequence}>Check Sequence</Button>
        <Button onClick={shuffleSequence} variant="outline">
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle
        </Button>
      </div>
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  );
}
