import { useJobDiscovery } from "@/hooks/useJobDiscovery";
import {
  JobDiscoveryHero,
  ChatContainer,
  ChatInput,
} from "@/components/job-discovery";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobDiscovery() {
  const {
    state,
    inputValue,
    messages,
    setInputValue,
    handleSubmit,
    handleClearChat,
    handleKeyPress,
  } = useJobDiscovery();

  const hasMessages = messages.length > 0;

  return (
    <AuroraBackground className="min-h-screen flex flex-col">
      {/* Hero Section - Condensed when there are messages */}
      <div className={cn(
        "w-full transition-all duration-500",
        hasMessages 
          ? "py-4 px-4" 
          : "flex-1 flex items-center justify-center p-4"
      )}>
        <div className={cn(
          "text-center transition-all duration-500",
          hasMessages ? "max-w-4xl mx-auto" : "space-y-8 animate-fade-in-up"
        )}>
          <JobDiscoveryHero className={hasMessages ? "space-y-2" : ""} />
          
          {hasMessages && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearChat}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear Chat
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      {hasMessages && (
        <div className="flex-1 min-h-0">
          <ChatContainer messages={messages} />
        </div>
      )}

      {/* Input Section */}
      <ChatInput
        inputValue={inputValue}
        state={state}
        onInputChange={setInputValue}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        hasMessages={hasMessages}
      />
    </AuroraBackground>
  );
}