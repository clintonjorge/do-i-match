interface JobDiscoveryHeroProps {
  className?: string;
}

export const JobDiscoveryHero = ({ className }: JobDiscoveryHeroProps) => {
  return (
    <div className={`space-y-4 ${className || ""}`}>
      <h1 className="text-5xl md:text-7xl font-bold font-space bg-gradient-primary bg-clip-text text-transparent leading-tight">
        Find me something good
      </h1>
      <p className="text-xl md:text-2xl font-space font-light text-muted-foreground">
        What is your dream job?
      </p>
    </div>
  );
};