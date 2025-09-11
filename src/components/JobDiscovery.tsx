import { useJobDiscovery } from "@/hooks/useJobDiscovery";
import {
  JobDiscoveryHero,
  JobDiscoveryForm,
  JobDiscoverySuccess,
  JobDiscoveryError,
} from "@/components/job-discovery";
import heroImage from "@/assets/futuristic-hero-bg.jpg";

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
    <div 
      className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
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
    </div>
  );
}