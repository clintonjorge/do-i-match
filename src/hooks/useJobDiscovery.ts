import { useState, useCallback } from "react";
import { jobService } from "@/services/jobService";
import type { JobDiscoveryState, JobDiscoveryResponse, ChatMessage } from "@/types/job";

interface UseJobDiscoveryReturn {
  state: JobDiscoveryState;
  inputValue: string;
  messages: ChatMessage[];
  setInputValue: (value: string) => void;
  handleSubmit: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const useJobDiscovery = (): UseJobDiscoveryReturn => {
  const [state, setState] = useState<JobDiscoveryState>("idle");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const processingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "",
      timestamp: new Date(),
      isProcessing: true,
    };

    setMessages(prev => [...prev, userMessage, processingMessage]);
    setState("processing");
    
    const currentInput = inputValue;
    setInputValue("");
    
    try {
      const response = await jobService.submitJobDiscovery({ input: currentInput });
      console.log("Received response in useJobDiscovery:", response);
      
      // Determine content to display
      let content: string;
      if (response.text_response && response.text_response.trim()) {
        console.log("Using text_response:", response.text_response);
        content = response.text_response;
      } else {
        console.log("No text_response found, trying to format job response");
        content = formatJobResponse(response);
      }
      
      const assistantMessage: ChatMessage = {
        id: processingMessage.id,
        type: "assistant",
        content,
        timestamp: new Date(),
        audio: response.audio,
      };

      setMessages(prev => prev.map(msg => 
        msg.id === processingMessage.id ? assistantMessage : msg
      ));
      setState("idle");
    } catch (error) {
      console.error("Job discovery error:", error);
      
      const errorMessage: ChatMessage = {
        id: processingMessage.id,
        type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => prev.map(msg => 
        msg.id === processingMessage.id ? errorMessage : msg
      ));
      setState("idle");
    }
  }, [inputValue]);


  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && state !== "processing") {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit, state]);

  return {
    state,
    inputValue,
    messages,
    setInputValue,
    handleSubmit,
    handleKeyPress,
  };
};

// Helper function to format job responses for display
const formatJobResponse = (response: JobDiscoveryResponse): string => {
  console.log("formatJobResponse called with:", response);
  
  if (response.matching_job_openings?.length) {
    return response.matching_job_openings.map(job => 
      `🎯 **${job.job_title}** at **${job.company}**\n` +
      `📍 ${job.location}\n` +
      `💰 ${job.salary_range || 'Salary not specified'}\n\n` +
      `${job.description}\n\n` +
      `**Why this matches:** ${job.why_match}\n\n` +
      `${job.application_link ? `[Apply Here](${job.application_link})` : ''}`
    ).join('\n\n---\n\n');
  }
  
  if (response.job_title) {
    return `🎯 **${response.job_title}**\n` +
           `🏢 ${response.company}\n` +
           `📍 ${response.location}\n\n` +
           `**Why this matches:** ${response.why_match}`;
  }
  
  // Better fallback with debugging info
  console.warn("No structured job data found in response, using fallback");
  return response.description || "I apologize, but I received an unexpected response format. Please try again.";
};