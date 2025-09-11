import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, RotateCcw, MapPin, Building2, ExternalLink } from "lucide-react";
import type { JobDiscoveryResponse, JobMatch } from "@/types/job";

interface JobDiscoverySuccessProps {
  result: JobDiscoveryResponse | null;
  onReset: () => void;
}

export const JobDiscoverySuccess = ({ result, onReset }: JobDiscoverySuccessProps) => {
  const jobs = result?.matching_job_openings || [];
  const hasMultipleJobs = jobs.length > 0;
  const primaryJob = hasMultipleJobs ? jobs[0] : null;

  // Fallback to legacy format if no structured jobs
  const displayJob = primaryJob || {
    job_title: result?.title || result?.job_title,
    company: result?.company,
    location: result?.location,
    description: result?.description,
    why_match: result?.why_match,
    application_link: result?.link
  };

  return (
    <Card className="animate-fade-in-up bg-card/90 backdrop-blur-sm border-2 border-primary/30 shadow-futuristic">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold font-space bg-gradient-primary bg-clip-text text-transparent">
              Perfect Match Found! 🚀
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-space">
            {hasMultipleJobs ? `Found ${jobs.length} matching opportunities` : "Here's your AI-matched career opportunity"}
          </p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 space-y-4 border border-primary/10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold font-space text-primary">
                {displayJob?.job_title || "AI-Matched Career Opportunity"}
              </h3>
              
              {(displayJob?.company || displayJob?.location) && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {displayJob?.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{displayJob.company}</span>
                    </div>
                  )}
                  {displayJob?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{displayJob.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {hasMultipleJobs && jobs.length > 1 && (
              <Badge variant="secondary" className="font-space">
                +{jobs.length - 1} more
              </Badge>
            )}
          </div>

          {displayJob?.description && (
            <p className="text-muted-foreground leading-relaxed">
              {displayJob.description}
            </p>
          )}

          {displayJob?.why_match && (
            <div className="bg-primary/5 rounded-md p-4 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Why this matches you:</h4>
              <p className="text-sm text-muted-foreground">{displayJob.why_match}</p>
            </div>
          )}

          {displayJob?.requirements && displayJob.requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Key Requirements:</h4>
              <div className="flex flex-wrap gap-2">
                {displayJob.requirements.slice(0, 4).map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {displayJob.requirements.length > 4 && (
                  <Badge variant="outline" className="text-xs opacity-60">
                    +{displayJob.requirements.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {displayJob?.application_link && (
            <Button variant="futuristic" size="lg" className="group" asChild>
              <a href={displayJob.application_link} target="_blank" rel="noopener noreferrer">
                Apply Now
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
          <Button 
            variant="ghostFuturistic" 
            size="lg" 
            onClick={onReset}
            className="group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};