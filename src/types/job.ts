export type JobDiscoveryState = "idle" | "processing" | "success" | "error";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
}

export interface JobMatch {
  job_title?: string;
  company?: string;
  location?: string;
  description?: string;
  requirements?: string[];
  why_match?: string;
  application_link?: string;
  salary_range?: string;
}

export interface JobDiscoveryResponse {
  matching_job_openings?: JobMatch[];
  title?: string;
  description?: string;
  link?: string;
  text_response?: string; // For plain text AI responses
  // Legacy fields for backward compatibility
  job_title?: string;
  company?: string;
  location?: string;
  why_match?: string;
}

export interface JobDiscoveryRequest {
  input: string;
}