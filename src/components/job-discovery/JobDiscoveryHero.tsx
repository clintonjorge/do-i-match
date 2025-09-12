interface JobDiscoveryHeroProps {
  className?: string;
}

export const JobDiscoveryHero = ({ className }: JobDiscoveryHeroProps) => {
  const hasMessages = className?.includes("space-y-2");
  
  return (
    <div className={`space-y-4 ${className || ""}`}>
      <h1 className={`font-bold text-black leading-tight transition-all duration-500 ${
        hasMessages ? "text-3xl md:text-4xl" : "text-5xl md:text-7xl"
      }`}>
        Match Maker
      </h1>
      <p className={`font-light text-black transition-all duration-500 ${
        hasMessages ? "text-lg" : "text-xl md:text-2xl"
      }`}>
        Finding roles that fit you best.
      </p>
    </div>
  );
};