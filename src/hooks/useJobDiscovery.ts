import { useState, useCallback } from "react";
import { jobService } from "@/services/jobService";
import type { JobDiscoveryState, JobDiscoveryResponse } from "@/types/job";

interface UseJobDiscoveryReturn {
  state: JobDiscoveryState;
  inputValue: string;
  result: JobDiscoveryResponse | null;
  setInputValue: (value: string) => void;
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const useJobDiscovery = (): UseJobDiscoveryReturn => {
  const [state, setState] = useState<JobDiscoveryState>("idle");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<JobDiscoveryResponse | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    setState("processing");
    
    try {
      const response = await jobService.submitJobDiscovery({ input: inputValue });
      setResult(response);
      setState("success");
    } catch (error) {
      console.error("Job discovery error:", error);
      setState("error");
    }
  }, [inputValue]);

  const handleReset = useCallback(() => {
    setState("idle");
    setInputValue("");
    setResult(null);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && state === "idle") {
      handleSubmit();
    }
  }, [handleSubmit, state]);

  return {
    state,
    inputValue,
    result,
    setInputValue,
    handleSubmit,
    handleReset,
    handleKeyPress,
  };
};