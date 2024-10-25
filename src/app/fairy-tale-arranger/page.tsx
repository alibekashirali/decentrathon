"use client"; // Add this line to mark this file as a Client Component

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shuffle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the interface for the story segment
interface StorySegment {
  id: number;
  text: string;
}

export default function FairyTaleArranger() {
  // Define the state with the correct types
  const [story, setStory] = useState<StorySegment[]>([]);
  const [originalStory, setOriginalStory] = useState<StorySegment[]>([]);
  const [playerSequence, setPlayerSequence] = useState<StorySegment[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [aiContent, setAiContent] = useState<string>(''); // State for AI content
  const [score, setScore] = useState<number>(0); // Score state

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    setLoading(true); // Start loading
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate a short story divided into 8 parts
      const result = await model.generateContent(["Generate a short story no more than 100 words about something interesting for children where should be 9-10 sentences and no more 12 words in one sentence."]);
      const generatedText = result.response.text();

      const splitStory = generatedText.split('.').map((sentence, index) => ({
        id: index + 1,
        text: sentence.trim() + (sentence.trim().endsWith('.') ? '' : '.') // Ensure each sentence ends with a period
      })).filter(sentence => sentence.text); // Filter out any empty sentences

      // Only take the first 8 sentences
      const eightSegments = splitStory.slice(0, 8);
      setOriginalStory(eightSegments);
      shuffleStory(eightSegments); // Shuffle the story immediately after fetching
    } catch (error) {
      console.error("Error fetching story:", error);
      setMessage("Sorry, there was an error generating the story. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const shuffleStory = (storyToShuffle: StorySegment[]) => {
    setStory([...storyToShuffle].sort(() => Math.random() - 0.5));
    setPlayerSequence([]);
    setMessage('');
  };

  const handleCardClick = (card: StorySegment) => {
    if (playerSequence.includes(card)) {
      setPlayerSequence(playerSequence.filter(item => item.id !== card.id));
    } else {
      setPlayerSequence([...playerSequence, card]);
    }
  };

  const checkSequence = async () => {
    const isCorrect = playerSequence.every((card, index) => card.id === index + 1);

    if (isCorrect) {
      setMessage("Correct! You've arranged the story perfectly!");
      setScore(score + 10); // Increase score
    } else {
      setMessage("Not quite right. Try rearranging the events.");
      await generateContent(playerSequence); // Generate AI content based on the player's current arrangement
    }
  };

  const generateContent = async (currentSequence: StorySegment[]) => {
    setLoading(true); // Start loading state
    const prompt = `Given the arrangement of the story segments: ${currentSequence.map(card => card.text).join(', ')}, what are the mistakes and how should the sequence be arranged correctly? no more 100 words for recommendation`;

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? ""); // Use environment variable
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
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fairy Tale Arranger</h1>
      <p className="mb-4">Arrange the events of given story in the correct order.</p>
      {loading ? (
        <p>Loading story...</p>
      ) : (
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
      )}
      <div className="flex gap-2 mb-4">
        <Button onClick={checkSequence}>Check Sequence</Button>
        <Button onClick={() => shuffleStory(originalStory)} variant="outline">
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle
        </Button>
      </div>
      {message && <p className="text-lg font-semibold">{message}</p>}
      
      {/* Display AI Content */}
      {aiContent && (
        <div className="p-4 mt-4 border rounded shadow">
          <h2 className="text-xl font-bold mb-2">AI Generated Advice</h2>
          <p>{aiContent}</p>
        </div>
      )}
    </div>
  );
}
