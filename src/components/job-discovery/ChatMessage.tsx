import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/job";
import ReactMarkdown from 'react-markdown';
import { AudioPlayer } from "@/components/ui/audio-player";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.type === "user";
  
  return (
    <div className={cn(
      "flex w-full animate-fade-in-up",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
        isUser 
          ? "bg-primary text-primary-foreground ml-4" 
          : "bg-card border border-border text-card-foreground mr-4"
      )}>
        {message.isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            </div>
            <span className="text-muted-foreground">Thinking...</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown 
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" />
                ),
                p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                strong: ({ node, ...props }) => <strong {...props} className="font-semibold" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        
        {/* Audio player */}
        {message.audio && message.audio.length > 0 && (
          <div className="mt-3">
            <AudioPlayer audioFile={message.audio[0]} />
          </div>
        )}
        
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};