"use client"; // Add this line to mark this file as a Client Component

"use client"; // Add this line to mark this file as a Client Component

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GoogleGenerativeAI } from "@google/generative-ai"

export default function NumberSequencer() {
  const [sequence, setSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [message, setMessage] = useState('')
  const [level, setLevel] = useState(1)
  const [recommendation, setRecommendation] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [aiContent, setAiContent] = useState('') // State to store AI content
  const [loading, setLoading] = useState(false) // State for loading
  const [showHint, setShowHint] = useState(false) // Power-up state
  const [progress, setProgress] = useState(0) // Progress bar state

  useEffect(() => {
    generateSequence()
    setRecommendation('Tip: Try to remember the correct order from the previous round.')
    updateProgress()
  }, [level])

  const generateSequence = () => {
    const newSequence = Array.from({ length: level + 2 }, (_, i) => i + 1)
    setSequence(newSequence.sort(() => Math.random() - 0.5))
    setPlayerSequence([])
    setMessage('')
    setAttempts(0)  // Reset attempts for each level
    setShowHint(false) // Reset hint power-up
  }

  const handleNumberClick = (number) => {
    if (playerSequence.includes(number)) {
      setPlayerSequence(playerSequence.filter(item => item !== number))
      setRecommendation('You removed a number. Check if you need to reorder.')
    } else {
      setPlayerSequence([...playerSequence, number])
      setRecommendation(`You added ${number}. Focus on the next number.`)
    }
  }

  const checkSequence = async () => {
    setAttempts(attempts + 1)

    const isCorrect = playerSequence.every((number, index) => number === index + 1)
    if (isCorrect) {
      setMessage('Correct! Moving to next level.')

      // Calculate score (10 points for correct answer, -1 per wrong attempt)
      const newScore = score + 10 - attempts;
      setScore(newScore);

      // Update recommendation based on score
      if (newScore > 50) {
        setRecommendation('Great job! You’re mastering this. Try the next level.');
      } else if (newScore > 30) {
        setRecommendation('Good work! Keep up the focus.');
      } else {
        setRecommendation('Keep practicing! You can improve by reviewing the sequence carefully.');
      }

      // Generate AI content based on performance
      await generateContent(newScore, attempts);
      setLevel(level + 1);
      updateProgress(); // Update progress bar

    } else {
      setMessage('Not quite right. Try again!');
      setRecommendation('Tip: Pay attention to the order of the numbers.');

      // Generate AI content for incorrect attempt
      await generateContent(score, attempts);
    }
  }

  const generateContent = async (score, attempts) => {
    setLoading(true); // Start loading state
    const prompt = `Give me recommendation using no more 100 words how to improve sequence strategy and skill based on my performance: Score ${score}, Attempts ${attempts}`;
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY); // Use environment variable
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
      const generatedText = result.response.text();
      setAiContent(generatedText);
    } catch (error) {
      console.error("Error generating AI content:", error);
      setAiContent("Sorry, there was an error generating the content. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const updateProgress = () => {
    const newProgress = (level / 10) * 100; // Assuming there are 10 levels
    setProgress(newProgress);
  }

  const handleHint = () => {
    if (!showHint) {
      setShowHint(true);
      const nextNumber = sequence[playerSequence.length]; // Next correct number in the sequence
      setRecommendation(`Hint: The next number is ${nextNumber}`);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Number Sequencer Safari</h1>
      <p className="mb-4">Arrange the numbers in ascending order. Current level: {level}</p>
      <p className="mb-4">Your score: {score}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full mb-4">
        <div className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}>Level Progress</div>
      </div>

      {/* Number sequence cards */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sequence.map(number => (
          <Card 
            key={number} 
            className={`cursor-pointer transform ${playerSequence.includes(number) ? 'border-primary scale-110' : ''}`}
            onClick={() => handleNumberClick(number)}
          >
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{number}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={checkSequence} className="mb-4">Check Sequence</Button>

      {/* Hint button */}
      {!showHint && (
        <Button onClick={handleHint} className="ml-2 mb-4">
          Use Hint (1 per level)
        </Button>
      )}

      {message && <p className="text-lg font-semibold">{message}</p>}

      {/* AI Assistant Recommendation Box */}
      <div className="p-4 mt-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">AI Assistant Recommendations</h2>
        <p>{recommendation}</p>
      </div>

      {/* Display AI Content */}
      {loading && <p>Loading recommendations...</p>}
      {aiContent && (
        <div className="p-4 mt-4 border rounded shadow">
          <h2 className="text-xl font-bold mb-2">AI Generated Advice</h2>
          <p>{aiContent}</p>
        </div>
      )}

      {/* Sound Effects */}
      <audio id="correct-sound" src="/sounds/correct.mp3"></audio>
      <audio id="incorrect-sound" src="/sounds/incorrect.mp3"></audio>
    </div>
  )
}
