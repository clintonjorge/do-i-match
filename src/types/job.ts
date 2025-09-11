export type JobDiscoveryState = "idle" | "processing" | "success" | "error";

export interface JobDiscoveryResponse {
  title?: string;
  description?: string;
  link?: string;
}

export interface JobDiscoveryRequest {
  input: string;
}