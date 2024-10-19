"use client";

import { useState } from 'react';
import Layout from '../layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Learn() {
  const [aiContent, setAiContent] = useState("AI-generated assistance content will appear here. Click 'Generate Content' to start!");
  const [loading, setLoading] = useState(false); // Add loading state

  const generateContent = async () => {
    setLoading(true); // Start loading spinner or state
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY); // Use environment variable
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(["Explain how AI works"]);
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
    <Layout>
      <h1 className="text-4xl font-bold text-center mb-8">Learn About Sequencing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Practice Regularly</AccordionTrigger>
                <AccordionContent>
                  Engage with sequencing activities daily. This could involve playing our games or finding other sequencing puzzles and activities.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Diversify Your Practice</AccordionTrigger>
                <AccordionContent>
                  Try different types of sequencing tasks, such as numerical sequences, alphabetical ordering, chronological events, and logical processes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Use Real-Life Applications</AccordionTrigger>
                <AccordionContent>
                  Apply sequencing skills to everyday tasks like following recipes, planning your day, or organizing a project.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Analyze Processes</AccordionTrigger>
                <AccordionContent>
                  When you encounter a complex task or process, break it down into smaller steps and try to understand the logical order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Reflect on Mistakes</AccordionTrigger>
                <AccordionContent>
                  When you make a sequencing error, take time to understand why the correct sequence is ordered as it is.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI-Generated Learning Content
              <Button onClick={generateContent} variant="outline" size="icon" disabled={loading}>
                {loading ? <RefreshCw className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{aiContent}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
