"use client"; // Add this line to mark this file as a Client Component

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shuffle } from 'lucide-react';

export default function SequenceSafari() {
  const animalStages = {
    elephant: ['Baby', 'Child', 'Teen', 'Adult'],
    lion: ['Cub', 'Juvenile', 'Sub-Adult', 'Adult'],
    giraffe: ['Calf', 'Young', 'Sub-Adult', 'Adult'],
    zebra: ['Foal', 'Yearling', 'Juvenile', 'Adult'],
  };

  const animals = ['elephant', 'lion', 'giraffe', 'zebra'];

  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30); // Timer starts at 30 seconds
  const [hint, setHint] = useState(false);

  // Countdown timer for player
  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // Generate new animal and sequence based on the level
  const generateNewSequence = () => {
    const currentAnimal = animals[(level - 1) % animals.length]; // Rotate animals
    const stages = animalStages[currentAnimal].slice(0, level + 2); // More stages as levels increase
    const newSequence = stages.map((stage, index) => ({
      id: index + 1,
      animal: currentAnimal,
      stage,
    }));
    setSequence(newSequence.sort(() => Math.random() - 0.5)); // Shuffle immediately after generating the sequence
    setPlayerSequence([]);
    setHint(false);
  };

  // Handle card selection
  const handleCardClick = (card) => {
    if (playerSequence.includes(card)) {
      setPlayerSequence(playerSequence.filter(item => item.id !== card.id));
    } else {
      setPlayerSequence([...playerSequence, card]);
    }
  };

  // Check if the player sequence is correct
  const checkSequence = () => {
    const isCorrect = playerSequence.length === sequence.length &&
      playerSequence.every((card, index) => card.id === sequence[index].id);
    
    if (isCorrect) {
      setMessage('Correct! Moving to the next level!');
      setScore(score + 10 + timer); // Add 10 points and bonus for remaining time
      setLevel(level + 1);  // Move to the next level
      setTimer(30); // Reset timer for the next level
      generateNewSequence(); // Generate new animal and sequence for next level
    } else {
      setMessage('Not quite right. Try again!');
      setScore(score - 5);  // Deduct points for wrong attempts
    }
  };

  // Display hint
  const displayHint = () => {
    setHint(true);
  };

  // Generate the sequence when the level changes
  useEffect(() => {
    generateNewSequence();
  }, [level]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sequence Safari</h1>
      <p className="mb-4">Arrange the {sequence[0]?.animal}'s life stages in the correct order.</p>
      <p className="mb-4">Level: {level}</p>
      <p className="mb-4">Score: {score}</p>
      <p className="mb-4">Time left: {timer} seconds</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {sequence.map(card => (
          <Card 
            key={card.id} 
            className={`cursor-pointer ${playerSequence.includes(card) ? 'border-primary' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <CardContent className="p-4">
              <div className="text-4xl">{card.animal === 'elephant' ? '🐘' : card.animal === 'lion' ? '🦁' : card.animal === 'giraffe' ? '🦒' : '🦓'}</div>
              <div className="text-sm">{card.stage}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={checkSequence}>Check Sequence</Button>
        <Button onClick={generateNewSequence} variant="outline">
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle
        </Button>
        <Button onClick={displayHint} variant="ghost">Hint</Button>
      </div>

      {hint && <p className="text-lg font-semibold">Hint: Start with the smallest animal stage.</p>}
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  );
}
