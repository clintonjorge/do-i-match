import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage as ChatMessageType } from "@/types/job";

interface ChatContainerProps {
  messages: ChatMessageType[];
}

export const ChatContainer = ({ messages }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = (force = false) => {
    if (force || !isUserScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToBottom = () => {
    setIsUserScrolled(false);
    setShowScrollToBottom(false);
    scrollToBottom(true);
  };

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const container = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsUserScrolled(!isNearBottom);
    setShowScrollToBottom(!isNearBottom && messages.length > 0);
  };

  useEffect(() => {
    // Only auto-scroll for new messages, not updates to existing ones
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isProcessing) {
      scrollToBottom();
    }
  }, [messages.length]); // Only depend on messages.length, not messages content

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      <ScrollArea 
        ref={scrollAreaRef} 
        className="h-full w-full"
        onScroll={handleScroll}
      >
        <div className="w-full px-4">
          <div className="space-y-4 py-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>
      
      {showScrollToBottom && (
        <button
          onClick={handleScrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200"
          aria-label="Scroll to bottom"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" transform="rotate(180 10 10)" />
          </svg>
        </button>
      )}
    </div>
  );
};