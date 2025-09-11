import { useJobDiscovery } from "@/hooks/useJobDiscovery";
import {
  JobDiscoveryHero,
  JobDiscoveryForm,
  JobDiscoverySuccess,
  JobDiscoveryError,
} from "@/components/job-discovery";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function JobDiscovery() {
  const {
    state,
    inputValue,
    result,
    setInputValue,
    handleSubmit,
    handleReset,
    handleKeyPress,
  } = useJobDiscovery();

  return (
    <AuroraBackground className="p-4">
      <div className="w-full max-w-2xl mx-auto">
        {state !== "success" && (
          <div className="text-center space-y-8 animate-fade-in-up">
            <JobDiscoveryHero />
            
            <JobDiscoveryForm
              inputValue={inputValue}
              state={state}
              onInputChange={setInputValue}
              onKeyPress={handleKeyPress}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {state === "success" && (
          <JobDiscoverySuccess 
            result={result} 
            onReset={handleReset}
          />
        )}

        {state === "error" && (
          <JobDiscoveryError onReset={handleReset} />
        )}
      </div>
    </AuroraBackground>
  );
}