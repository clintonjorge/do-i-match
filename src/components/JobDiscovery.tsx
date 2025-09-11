import { useJobDiscovery } from "@/hooks/useJobDiscovery";
import {
  JobDiscoveryHero,
  ChatContainer,
  ChatInput,
} from "@/components/job-discovery";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { cn } from "@/lib/utils";

export default function JobDiscovery() {
  const {
    state,
    inputValue,
    messages,
    setInputValue,
    handleSubmit,
    handleKeyPress,
  } = useJobDiscovery();

  const hasMessages = messages.length > 0;

  return (
    <AuroraBackground className="min-h-screen flex flex-col">
      {hasMessages ? (
        // Layout when there are messages - input at bottom
        <>
          {/* Hero Section - Condensed */}
          <div className="w-full py-4 px-4 transition-all duration-500">
            <div className="text-center max-w-4xl mx-auto transition-all duration-500">
              <JobDiscoveryHero className="space-y-2" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-0">
            <ChatContainer messages={messages} />
          </div>

          {/* Input at bottom */}
          <ChatInput
            inputValue={inputValue}
            state={state}
            onInputChange={setInputValue}
            onKeyPress={handleKeyPress}
            onSubmit={handleSubmit}
            hasMessages={hasMessages}
          />
        </>
      ) : (
        // Layout when no messages - input centered with hero
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          <div className="text-center space-y-8 animate-fade-in-up">
            <JobDiscoveryHero />
          </div>
          
          {/* Centered Input */}
          <div className="w-full max-w-5xl">
            <ChatInput
              inputValue={inputValue}
              state={state}
              onInputChange={setInputValue}
              onKeyPress={handleKeyPress}
              onSubmit={handleSubmit}
              hasMessages={hasMessages}
            />
          </div>
        </div>
      )}
    </AuroraBackground>
  );
}