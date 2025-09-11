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
      
      const rawData = await response.json();
      
      // Process and normalize the response data
      return this.processWebhookResponse(rawData);
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