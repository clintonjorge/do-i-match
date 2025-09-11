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
      
      return await response.json();
    } catch (error) {
      if (error instanceof JobServiceError) {
        throw error;
      }
      
      console.error("Job discovery API error:", error);
      throw new JobServiceError("Network error occurred while submitting job discovery");
    }
  }
};