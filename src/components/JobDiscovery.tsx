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
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 animate-gradient-shift pointer-events-none"
        style={{
          background: 'var(--gradient-animated)',
          backgroundSize: '400% 400%',
          opacity: 0.1
        }}
      />
      
      {/* Hero image animation */}
      <div 
        className="absolute inset-0 animate-hero-breathe pointer-events-none"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          opacity: 0.8
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float-particles blur-sm" style={{ animationDelay: '0s' }} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-float-particles blur-sm" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-float-particles blur-sm" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent/30 rounded-full animate-float-particles blur-sm" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-2/3 w-2 h-2 bg-primary/25 rounded-full animate-float-particles blur-sm" style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Moving light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 -left-full w-1 h-screen animate-light-ray"
          style={{
            background: 'var(--gradient-light-ray)',
            animationDelay: '0s'
          }}
        />
        <div 
          className="absolute top-0 -left-full w-0.5 h-screen animate-light-ray"
          style={{
            background: 'var(--gradient-light-ray)',
            animationDelay: '5s'
          }}
        />
      </div>

      {/* Enhanced ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-ambient-pulse pointer-events-none" />
      
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