interface JobDiscoveryHeroProps {
  className?: string;
}

export const JobDiscoveryHero = ({ className }: JobDiscoveryHeroProps) => {
  return (
    <div className={`space-y-4 ${className || ""}`}>
      <h1 className="text-5xl md:text-7xl font-bold font-space text-black leading-tight">
        Find me something good
      </h1>
      <p className="text-xl md:text-2xl font-space font-light text-black">
        What is your dream job?
      </p>
    </div>
  );
};