"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown";

import { GoogleGenerativeAI } from "@google/generative-ai"
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "");

interface Task {
  task: string;
  vocabularies: string[];
}

interface Feedback {
  overallFeedback: string;
  bandScore: number;
  improvements: string[];
}

export default function AITaskGenerator() {
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);  // Add wordCount state
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const generateTask = async () => {
    setIsLoading(true);
    setError(null);
    setEssay('');
    setWordCount(0);  // Reset word count on new task generation
    setFeedback(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Generate an IELTS writing task with 5 relevant vocabulary words. Format the response as JSON with 'task' and 'vocabularies' fields.";
      const result = await model.generateContent([prompt]);
      const text = result.response.text()
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}') + 1; 

      if (startIndex !== -1 && endIndex !== -1) {
        const jsonString = text.slice(startIndex, endIndex);

        const jsonResponse = JSON.parse(jsonString);
        console.log(jsonResponse);
        setCurrentTask(jsonResponse);
      } else {
        console.error("No JSON found");
      }

    } catch (err) {
      console.error("Error generating task:", err);
      setError("Failed to generate task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isFinished) {
      setIsFinished(true)
      generateFeedback()
    }
  }, [timeLeft, isFinished])

  const generateFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Imagine that you strict IELTS Examiner and you are tasked with analyzing an IELTS essay based on the task: "${currentTask}". Your goal is to provide feedback on how well the essay meets the requirements of the task. Your response should include an 'overallFeedback' section summarizing the strengths and weaknesses of the essay, a 'bandScore' section estimating the likely IELTS band score (based on the task response, coherence, lexical resource, and grammar), and an 'improvements' section outlining specific areas where the essay can be enhanced. Please format your response as a JSON object with 'overallFeedback', 'bandScore', and 'improvements' fields. Here is the essay: "${essay}"`;
      const result_feedback = await model.generateContent([prompt]);

      const text_feedback = result_feedback.response.text()
      const startIndex = text_feedback.indexOf('{');
      const endIndex = text_feedback.lastIndexOf('}') + 1; 

      if (startIndex !== -1 && endIndex !== -1) {
        const jsonStringFeedback = text_feedback.slice(startIndex, endIndex);

        const jsonResponseFeedback = JSON.parse(jsonStringFeedback);
        setFeedback(jsonResponseFeedback);
      } else {
        console.error("No JSON found");
      }
    } catch (err) {
      console.error("Error generating feedback:", err);
      setError("Failed to generate feedback. Please try again.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  // Update word count whenever essay changes
  useEffect(() => {
    const words = essay.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [essay]);

  useEffect(() => {
    generateTask();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generated Writing Task</CardTitle>
          <CardDescription>Complete the task using the suggested vocabulary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : currentTask ? (
            <>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Task:</h3>
                <p>{currentTask.task}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Suggested Vocabulary:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentTask.vocabularies.map((word, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Response:</h3>
                <Textarea
                  placeholder="Write your essay here..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-right mt-2 text-sm text-muted-foreground">
                  Word Count: {wordCount}
                </p>
              </div>
            </>
          ) : null}
          <Progress value={((1200 - timeLeft) / 1200) * 100} className="mb-2" />
          <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={generateTask} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate New Task
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setEssay('')} disabled={!essay}>
              Clear Essay
            </Button>
            <Button onClick={generateFeedback} disabled={!essay || isFeedbackLoading}>
              {isFeedbackLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Generated Feedback</CardTitle>
        <CardDescription>Analysis and advice to improve your IELTS band score</CardDescription>
      </CardHeader>
      <CardContent>
        {isFeedbackLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : feedback ? (
          <ScrollArea className="h-[650px] pr-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Overall Feedback:</h3>
                <p>{feedback.overallFeedback}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Estimated Band Score:</h3>
                <Badge variant="secondary" className="text-lg">
                  {feedback.bandScore}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Areas for Improvement:</h3>
                <ReactMarkdown>
                {Array.isArray(feedback?.improvements)
                    ? feedback.improvements.map((improvement) => `- ${improvement}`).join("\n")
                    : "No improvements available"}
                </ReactMarkdown>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground">Submit your essay to receive feedback.</p>
        )}
      </CardContent>
    </Card>
  </div>
  )
}
