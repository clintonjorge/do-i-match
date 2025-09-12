import { API_ENDPOINTS, REQUEST_HEADERS } from "@/constants/api";
import type { JobDiscoveryRequest, JobDiscoveryResponse } from "@/types/job";

export class JobServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "JobServiceError";
  }
}

export const jobService = {
  async submitJobDiscovery(request: JobDiscoveryRequest): Promise<JobDiscoveryResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.JOB_DISCOVERY_WEBHOOK, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new JobServiceError(
          `Failed to submit job discovery: ${response.statusText}`,
          response.status
        );
      }
      
      // Check if response is JSON or plain text
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      
      if (isJson) {
        const rawData = await response.json();
        return this.processWebhookResponse(rawData);
      } else {
        // Handle plain text response
        const textData = await response.text();
        return { text_response: textData };
      }
    } catch (error) {
      if (error instanceof JobServiceError) {
        throw error;
      }
      
      console.error("Job discovery API error:", error);
      throw new JobServiceError("Network error occurred while submitting job discovery");
    }
  },

  processWebhookResponse(data: any): JobDiscoveryResponse {
    try {
      console.log("Processing webhook response:", data);
      console.log("Response type:", typeof data);
      console.log("Is array:", Array.isArray(data));
      
      // Handle direct content structure (actual webhook format)
      if (data.content && typeof data.content === 'object') {
        console.log("Found direct content structure:", data.content);
        const audioFiles = [];
        if (data.content.audio?.data) {
          console.log("Found audio data, adding to response");
          audioFiles.push({
            data: data.content.audio.data,
            mimeType: 'audio/mp3',
            fileType: 'audio',
            fileExtension: 'mp3'
          });
        }
        
        const textResponse = data.content.text || data.content;
        console.log("Extracted text response:", textResponse);
        
        const result = {
          text_response: textResponse,
          audio: audioFiles
        };
        console.log("Returning processed response:", result);
        return result;
      }
      
      // Handle array-based response format with nested content structure
      if (Array.isArray(data) && data.length > 0 && data[0].message) {
        console.log("Found array response with message, extracting content and audio");
        const messageData = data[0].message;
        console.log("Message data:", messageData);
        console.log("Content type:", typeof messageData.content);
        
        // Handle new nested content structure
        if (messageData.content && typeof messageData.content === 'object') {
          console.log("Processing nested content structure:", messageData.content);
          const audioFiles = [];
          if (messageData.content.audio?.data) {
            console.log("Found audio data, adding to response");
            audioFiles.push({
              data: messageData.content.audio.data,
              mimeType: 'audio/mp3',
              fileType: 'audio',
              fileExtension: 'mp3'
            });
          }
          
          const textResponse = messageData.content.text || messageData.content;
          console.log("Extracted text response:", textResponse);
          
          const result = {
            text_response: textResponse,
            audio: audioFiles
          };
          console.log("Returning processed response:", result);
          return result;
        }
        
        // Fallback for legacy format
        console.log("Using legacy format fallback");
        const legacyResult = {
          text_response: messageData.content,
          audio: messageData.audio || []
        };
        console.log("Legacy result:", legacyResult);
        return legacyResult;
      }
      
      // Handle output field from webhook
      if (data.output) {
        console.log("Found data.output, extracting as text response");
        return { text_response: data.output };
      }
      
      // Handle message.content structure (legacy AI response format)
      if (data.message?.content) {
        console.log("Found message.content, extracting as text response");
        return { 
          text_response: data.message.content,
          audio: data.message.audio || []
        };
      }
      
      // Handle nested response structure
      if (data.matching_job_openings && Array.isArray(data.matching_job_openings)) {
        return {
          matching_job_openings: data.matching_job_openings.map((job: any) => ({
            job_title: job.job_title || job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements : 
                         job.requirements ? [job.requirements] : [],
            why_match: job.why_match || job.match_reason,
            application_link: job.application_link || job.link,
            salary_range: job.salary_range || job.salary
          })),
          ...data
        };
      }
      
      // Handle legacy single job format
      return {
        title: data.title || data.job_title,
        description: data.description,
        link: data.link || data.application_link,
        job_title: data.job_title,
        company: data.company,
        location: data.location,
        why_match: data.why_match,
        ...data
      };
    } catch (error) {
      console.error("Error processing webhook response:", error);
      // Return original data if processing fails
      return data;
    }
  }
};