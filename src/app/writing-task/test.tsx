// "use client"

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Progress } from "@/components/ui/progress"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// export default function TimedWritingChallenge() {
//   const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
//   const [essay, setEssay] = useState('')
//   const [isFinished, setIsFinished] = useState(false)
//   const [feedback, setFeedback] = useState('')

//   useEffect(() => {
//     if (timeLeft > 0 && !isFinished) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
//       return () => clearTimeout(timer)
//     } else if (timeLeft === 0 && !isFinished) {
//       setIsFinished(true)
//       provideFeedback()
//     }
//   }, [timeLeft, isFinished])

//   const handleSubmit = () => {
//     setIsFinished(true)
//     provideFeedback()
//   }

//   const provideFeedback = () => {
//     // This is where you'd typically call an AI service to analyze the essay
//     // For demo purposes, we'll provide some mock feedback
//     const wordCount = essay.split(' ').length
//     let feedbackText = `You wrote ${wordCount} words. `
//     if (wordCount < 150) {
//       feedbackText += "Try to write more to fully develop your ideas."
//     } else if (wordCount > 250) {
//       feedbackText += "Good job on writing a substantial amount. Make sure to stay focused on the main points."
//     } else {
//       feedbackText += "Great job on hitting the target word count!"
//     }
//     setFeedback(feedbackText)
//   }

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>Timed Writing Challenge</CardTitle>
//         <CardDescription>Write an essay on the given topic within 5 minutes.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p className="mb-4">Topic: Discuss the advantages and disadvantages of social media.</p>
//         <Textarea
//           placeholder="Start writing your essay here..."
//           value={essay}
//           onChange={(e) => setEssay(e.target.value)}
//           disabled={isFinished}
//           className="h-48 mb-4"
//         />
//         <Progress value={(300 - timeLeft) / 3} className="mb-2" />
//         <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
//       </CardContent>
//       <CardFooter className="flex flex-col items-start">
//         <Button onClick={handleSubmit} disabled={isFinished}>Submit Essay</Button>
//         {isFinished && (
//           <div className="mt-4">
//             <h3 className="font-bold mb-2">Feedback:</h3>
//             <p>{feedback}</p>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   )
// }


// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { GoogleGenerativeAI } from "@google/generative-ai"; // Import your AI client
// import ReactMarkdown from "react-markdown"; // Import markdown renderer

// export default function IELTSWritingGame() {
//   const [level, setLevel] = useState(1); // Starts at A1
//   const [prompt, setPrompt] = useState("");
//   const [vocabulary, setVocabulary] = useState([]);
//   const [userWriting, setUserWriting] = useState("");
//   const [aiFeedback, setAiFeedback] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(600); // Initial 10 minutes
//   const [score, setScore] = useState(0);

//   // Timer effect
//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft]);

//   // Fetch AI-generated prompt and vocabulary based on CEFR level
//   useEffect(() => {
//     const fetchAIPromptAndVocabulary = async () => {
//       setLoading(true);
//       try {
//         const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY); // API key for generative AI
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const aiPrompt = `Generate a writing task and vocabulary for CEFR level ${
//           getCEFRLevel(level)
//         } in IELTS exam preparation. The writing task should be appropriate for the level.`;
//         const result = await model.generateContent([aiPrompt]);
//         const generatedText = result.response.text();

//         // Clean the AI response: remove unwanted commas, trim spaces
//         const cleanedText = generatedText.replace(/, ,/g, "\n").replace(/, /g, "\n");

//         setPrompt(cleanedText); // Set cleaned text as prompt (with markdown)
//         setTimeLeft(getTimeLimit(level)); // Set time limit based on level

//       } catch (error) {
//         console.error("Error generating AI prompt:", error);
//         setPrompt("Error generating prompt. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAIPromptAndVocabulary();
//   }, [level]);

//   const getCEFRLevel = (level) => {
//     switch (level) {
//       case 1: return "A1";
//       case 2: return "A2";
//       case 3: return "B1";
//       case 4: return "B2";
//       case 5: return "C1";
//       case 6: return "C2";
//       default: return "A1";
//     }
//   };

//   const getTimeLimit = (level) => {
//     switch (level) {
//       case 1: return 300;
//       case 2: return 600;
//       case 3: return 900;
//       case 4: return 1200;
//       case 5: return 1800;
//       case 6: return 2400;
//       default: return 300;
//     }
//   };

//   const handleWritingChange = (e) => {
//     setUserWriting(e.target.value);
//   };

//   const submitWriting = async () => {
//     setLoading(true);
//     try {
//       const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const feedbackPrompt = `Provide feedback on the following IELTS essay at level ${getCEFRLevel(level)}: ${userWriting}`;
//       const result = await model.generateContent([feedbackPrompt]);
//       const generatedFeedback = result.response.text();

//       // Clean the AI feedback: remove unwanted commas, trim spaces
//       const cleanedFeedback = generatedFeedback.replace(/, ,/g, "\n").replace(/, /g, "\n");

//       setAiFeedback(cleanedFeedback); // Display AI-generated feedback as markdown
//       setScore(score + (level * 10)); // Add score based on level

//     } catch (error) {
//       console.error("Error generating AI feedback:", error);
//       setAiFeedback("Sorry, there was an error generating the feedback. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextLevel = () => {
//     setLevel(level < 6 ? level + 1 : 6); // Limit to CEFR C2 (level 6)
//     setUserWriting(""); // Clear writing area
//     setAiFeedback("");  // Clear feedback
//   };

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">IELTS Writing Game - CEFR Level {getCEFRLevel(level)}</h1>
//       <div className="flex">
//         {/* Left side: Writing textarea */}
//         <div className="w-1/2 pr-4">
//           <h2 className="text-lg font-bold mb-2">Your Writing Area</h2>
//           <textarea
//             value={userWriting}
//             onChange={handleWritingChange}
//             className="w-full p-4 border rounded"
//             rows={10}
//             placeholder="Start writing your essay here..."
//           />
//           <p className="mt-2 text-gray-500">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}{timeLeft % 60}</p>

//           <Button onClick={submitWriting} className="mt-4" disabled={loading || timeLeft <= 0}>
//             Submit Writing
//           </Button>
//           <div className="mt-4">
//             <Button onClick={nextLevel} disabled={level >= 6}>
//               Next Level
//             </Button>
//           <p>Score: {score}</p>
//           </div>
//         </div>

//         {/* Right side: Prompt and Vocabulary */}
//         <div className="w-1/2 pl-4">
//           <Card className="mb-4">
//             <CardContent>
//               <h2 className="text-lg font-bold mb-2">Writing Task</h2>
//               {/* Render markdown for the task */}
//               <ReactMarkdown>{prompt}</ReactMarkdown>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {loading && <p>Generating feedback...</p>}

//       {aiFeedback && (
//         <Card className="mt-4">
//           <CardContent>
//             <h2 className="text-xl font-bold mb-2">AI Feedback</h2>
//             {/* Render markdown for the feedback */}
//             <ReactMarkdown>{aiFeedback}</ReactMarkdown>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }





// const text = result.response.text()
// const startIndex = text.indexOf('{');
// const endIndex = text.lastIndexOf('}') + 1; 

// if (startIndex !== -1 && endIndex !== -1) {
//   const jsonString = text.slice(startIndex, endIndex);

//   const jsonResponse = JSON.parse(jsonString);
//   console.log(jsonResponse);
//   setCurrentTask(jsonResponse);
// } else {
//   console.error("No JSON found");
// }


// "use client"

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import { Loader2 } from 'lucide-react'

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// interface Task {
//   task: string;
//   vocabularies: string[];
// }

// export default function AITaskGenerator() {
//   const [currentTask, setCurrentTask] = useState<Task | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [essay, setEssay] = useState('');

//   const generateTask = async () => {
//     setIsLoading(true);
//     setError(null);
//     setEssay(''); // Clear previous essay when generating a new task
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const prompt = "Generate an IELTS writing task with 5 relevant vocabulary words. Format the response as JSON with 'task' and 'vocabularies' fields.";
//       const result = await model.generateContent([prompt]);
      
//       const text = result.response.text()
//       const startIndex = text.indexOf('{');
//       const endIndex = text.lastIndexOf('}') + 1; 

//       if (startIndex !== -1 && endIndex !== -1) {
//         const jsonString = text.slice(startIndex, endIndex);

//         const jsonResponse = JSON.parse(jsonString);
//         console.log(jsonResponse);
//         setCurrentTask(jsonResponse);
//       } else {
//         console.error("No JSON found");
//       }
//     } catch (err) {
//       console.error("Error generating task:", err);
//       setError("Failed to generate task. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateTask();
//   }, []);

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>AI-Generated Writing Task</CardTitle>
//         <CardDescription>Complete the task using the suggested vocabulary</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <Loader2 className="h-8 w-8 animate-spin" />
//           </div>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : currentTask ? (
//           <>
//             <div className="p-4 bg-muted rounded-lg">
//               <h3 className="font-semibold mb-2">Task:</h3>
//               <p>{currentTask.task}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-2">Suggested Vocabulary:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {currentTask.vocabularies.map((word, index) => (
//                   <Badge key={index} variant="outline" className="px-3 py-1 text-sm bg-primary/10">
//                     {word}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-2">Your Response:</h3>
//               <Textarea
//                 placeholder="Write your essay here..."
//                 value={essay}
//                 onChange={(e) => setEssay(e.target.value)}
//                 className="min-h-[200px]"
//               />
//             </div>
//           </>
//         ) : null}
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button onClick={generateTask} disabled={isLoading}>
//           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//           Generate New Task
//         </Button>
//         <Button variant="outline" onClick={() => setEssay('')} disabled={!essay}>
//           Clear Essay
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

// "use client"

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import { Loader2 } from 'lucide-react'
// import { Progress } from "@/components/ui/progress"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import ReactMarkdown from "react-markdown";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// import { GoogleGenerativeAI } from "@google/generative-ai"
// import OpenAI from "openai";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);


// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
// });

// interface Task {
//   task: string;
//   vocabularies: string[];
// }

// interface Feedback {
//   overallFeedback: string;
//   bandScore: number;
//   improvements: string[];
// }

// const models = [
//   { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
//   { value: "gpt-4o-mini", label: "GPT 4o Mini" }
// ]

// export default function AITaskGenerator() {
//   const [timeLeft, setTimeLeft] = useState(50) // 20 minutes
//   const [currentTask, setCurrentTask] = useState<Task | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFinished, setIsFinished] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [essay, setEssay] = useState('');
//   const [feedback, setFeedback] = useState<Feedback | null>(null);
//   const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
//   const [feedbackModel, setFeedbackModel] = useState("gemini-1.5-flash");

//   const generateTask = async () => {
//     setIsLoading(true);
//     setError(null);
//     setEssay('');
//     setFeedback(null);
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const prompt = "Generate an IELTS writing task with 5 relevant vocabulary words. Format the response as JSON with 'task' and 'vocabularies' fields.";
//       const result = await model.generateContent([prompt]);
//       const text = result.response.text()
//       const startIndex = text.indexOf('{');
//       const endIndex = text.lastIndexOf('}') + 1; 

//       if (startIndex !== -1 && endIndex !== -1) {
//         const jsonString = text.slice(startIndex, endIndex);

//         const jsonResponse = JSON.parse(jsonString);
//         console.log(jsonResponse);
//         setCurrentTask(jsonResponse);
//       } else {
//         console.error("No JSON found");
//       }

//     } catch (err) {
//       console.error("Error generating task:", err);
//       setError("Failed to generate task. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (timeLeft > 0 && !isFinished) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
//       return () => clearTimeout(timer)
//     } else if (timeLeft === 0 && !isFinished) {
//       setIsFinished(true)
//       generateFeedback()
//     }
//   }, [timeLeft, isFinished])

//   const generateFeedback = async () => {
//     setIsFeedbackLoading(true);
//     try {

//       const prompt = `Imagine you are an IELTS examiner analyzing an essay for task: "${currentTask?.task}". Provide feedback with 'overallFeedback', 'bandScore', and 'improvements' fields. Essay: "${essay}"`;
      
//       let text_feedback = "";

//       if (feedbackModel === "gemini-1.5-flash") {
//         const model = genAI.getGenerativeModel({ model: feedbackModel });
//         const result_feedback = await model.generateContent([prompt]);
//         text_feedback = result_feedback.response.text();
//       } else if (feedbackModel === "gpt-4o-mini") {
//         const chatCompletion = await openai.chat.completions.create({
//           model: feedbackModel,
//           messages: [{"role": "user", "content": prompt}],
//         });
//         text_feedback = chatCompletion.choices[0].message?.content || "";
//       }
//       // const model = genAI.getGenerativeModel({ model: feedbackModel });
//       // const prompt = `Analyze the following IELTS essay that must be based on this task: "${currentTask}" and provide feedback. Format the response as JSON with 'overallFeedback', 'bandScore', and 'improvements' fields. Essay: "${essay}"`;
//       // const prompt = `Imagine that you strict IELTS Examiner and you are tasked with analyzing an IELTS essay based on the task: "${currentTask}". Your goal is to provide feedback on how well the essay meets the requirements of the task. Your response should include an 'overallFeedback' section summarizing the strengths and weaknesses of the essay, a 'bandScore' section estimating the likely IELTS band score (based on the task response, coherence, lexical resource, and grammar), and an 'improvements' section outlining specific areas where the essay can be enhanced. Please format your response as a JSON object with 'overallFeedback', 'bandScore', and 'improvements' fields. Here is the essay: "${essay}"`;
//       // const result_feedback = await model.generateContent([prompt]);

//       // const text_feedback = result_feedback.response.text()
//       const startIndex = text_feedback.indexOf('{');
//       const endIndex = text_feedback.lastIndexOf('}') + 1; 

//       if (startIndex !== -1 && endIndex !== -1) {
//         const jsonStringFeedback = text_feedback.slice(startIndex, endIndex);

//         const jsonResponseFeedback = JSON.parse(jsonStringFeedback);
//         setFeedback(jsonResponseFeedback);
//       } else {
//         console.error("No JSON found");
//       }
//     } catch (err) {
//       console.error("Error generating feedback:", err);
//       setError("Failed to generate feedback. Please try again.");
//     } finally {
//       setIsFeedbackLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateTask();
//   }, []);

//   return (
//     <div className="flex gap-4">
//       <Card className="w-full max-w-2xl">
//         <CardHeader>
//           <CardTitle>Generated Writing Task</CardTitle>
//           <CardDescription>Complete the task using the suggested vocabulary</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-32">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : currentTask ? (
//             <>
//               <div className="p-4 bg-muted rounded-lg">
//                 <h3 className="font-semibold mb-2">Task:</h3>
//                 <p>{currentTask.task}</p>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2">Suggested Vocabulary:</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {currentTask.vocabularies.map((word, index) => (
//                     <Badge key={index} variant="outline" className="px-3 py-1 text-sm bg-primary/10">
//                       {word}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2">Your Response:</h3>
//                 <Textarea
//                   placeholder="Write your essay here..."
//                   value={essay}
//                   onChange={(e) => setEssay(e.target.value)}
//                   disabled={isFinished}
//                   className="h-48 mb-4"
//                 />
//               </div>
//             </>
//           ) : null}
//           <Progress value={((1200 - timeLeft) / 1200) * 100} className="mb-2" />
//           <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button onClick={generateTask} disabled={isLoading}>
//             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//             Generate New Task
//           </Button>
//           <div className="space-x-2">
//             <Button variant="outline" onClick={() => setEssay('')} disabled={!essay}>
//               Clear Essay
//             </Button>
//             <Button onClick={generateFeedback} disabled={!essay || isFeedbackLoading}>
//               {isFeedbackLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//               Submit
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//       <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Generated Feedback</CardTitle>
//         <CardDescription>Analysis and advice to improve your IELTS band score</CardDescription>
//         <Select value={feedbackModel} onValueChange={setFeedbackModel}>
//               <SelectTrigger id="feedback-model" className="w-[180px]">
//                 <SelectValue placeholder="Select model" />
//               </SelectTrigger>
//               <SelectContent>
//                 {models.map((model) => (
//                   <SelectItem key={model.value} value={model.value}>
//                     {model.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent>
//         {isFeedbackLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <Loader2 className="h-8 w-8 animate-spin" />
//           </div>
//         ) : feedback ? (
//           <ScrollArea className="h-[650px] pr-4">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold mb-2">Overall Feedback:</h3>
//                 <p>{feedback.overallFeedback}</p>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2">Estimated Band Score:</h3>
//                 <Badge variant="secondary" className="text-lg">
//                   {feedback.bandScore}
//                 </Badge>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2">Areas for Improvement:</h3>
//                 <ReactMarkdown>
//                   {Array.isArray(feedback?.improvements)
//                     ? feedback.improvements.map((improvement) => `- ${improvement}`).join("\n")
//                     : "No improvements available"}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           </ScrollArea>
//         ) : (
//           <p className="text-muted-foreground">Submit your essay to receive feedback.</p>
//         )}
//       </CardContent>
//     </Card>

//     </div>
//   )
// }

