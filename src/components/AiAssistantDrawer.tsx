"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Play,
  Copy,
  Check,
  HelpCircle,
  AlertCircle,
  X,
  Code2,
} from "lucide-react";
import { AiMessage } from "@/types";

interface AiAssistantDrawerProps {
  onClose: () => void;
  onRunCommand: (command: string) => void;
  onInsertCommand: (command: string) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  onClose,
  onRunCommand,
  onInsertCommand,
}) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: "ai-1",
      role: "assistant",
      content:
        "Hello! I am the **AASM AI Assistant**. I can translate plain English into shell commands, explain syntax, or diagnose errors.",
      suggestedCommand: "dir -l -h | findstr /i cargo",
      timestamp: Date.now(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputVal,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputVal.toLowerCase();
    setInputVal("");

    // Generate intelligent AI suggestion response
    setTimeout(() => {
      let replyContent = "";
      let suggestedCmd = "";

      if (query.includes("git") || query.includes("branch") || query.includes("commit")) {
        replyContent = "Here is the recommended Git command for your intent:";
        suggestedCmd = "git status --short --branch";
      } else if (query.includes("process") || query.includes("memory") || query.includes("task")) {
        replyContent = "You can monitor and filter system processes using the built-in `task` command:";
        suggestedCmd = "task find cargo";
      } else if (query.includes("kill") || query.includes("stop")) {
        replyContent = "To terminate a running task safely by name or PID:";
        suggestedCmd = "kill -f node.exe";
      } else if (query.includes("find") || query.includes("search") || query.includes("grep")) {
        replyContent = "You can search files with pipes and filter tools:";
        suggestedCmd = "dir -l | findstr /i \"src\"";
      } else {
        replyContent = `Here is the AASM command tailored for: "${query}":`;
        suggestedCmd = `echo "Executing: ${query}"`;
      }

      const aiReply: AiMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        suggestedCommand: suggestedCmd,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 300);
  };

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-80 h-full bg-surface border-l border-surface-border flex flex-col select-none z-30 animate-fade-in">
      {/* Header */}
      <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-foreground">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>AASM Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 text-muted hover:text-foreground rounded">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-b border-surface-border flex flex-wrap gap-1">
        <button
          onClick={() => {
            setInputVal("How do I find top memory processes?");
          }}
          className="text-[11px] bg-background hover:bg-surface-hover border border-surface-border text-muted hover:text-foreground px-2 py-1 rounded transition-colors"
        >
          🔍 Find heavy tasks
        </button>
        <button
          onClick={() => {
            setInputVal("Show me git commit log with graph");
          }}
          className="text-[11px] bg-background hover:bg-surface-hover border border-surface-border text-muted hover:text-foreground px-2 py-1 rounded transition-colors"
        >
          🌿 Git log graph
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col space-y-1.5 ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-background font-medium"
                  : "bg-background border border-surface-border text-foreground/90"
              }`}
            >
              {m.content}
            </div>

            {/* Suggested Command Card */}
            {m.suggestedCommand && (
              <div className="w-full bg-surface-hover border border-primary/30 rounded-md p-2 space-y-2 mt-1 animate-fade-in">
                <div className="flex items-center justify-between text-[11px] text-primary font-bold">
                  <div className="flex items-center space-x-1">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Suggested Command:</span>
                  </div>
                  <button
                    onClick={() => copyCommand(m.suggestedCommand!, m.id)}
                    className="text-muted hover:text-foreground"
                    title="Copy command"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="bg-background font-mono text-[11px] text-foreground p-1.5 rounded border border-surface-border truncate">
                  {m.suggestedCommand}
                </div>

                <div className="flex space-x-1.5 pt-1">
                  <button
                    onClick={() => onInsertCommand(m.suggestedCommand!)}
                    className="flex-1 text-[10px] bg-surface border border-surface-border hover:bg-surface-border py-1 rounded text-foreground font-medium transition-colors"
                  >
                    Insert in Shell
                  </button>
                  <button
                    onClick={() => onRunCommand(m.suggestedCommand!)}
                    className="flex-1 text-[10px] bg-primary hover:bg-primary-hover text-background py-1 rounded font-bold transition-colors flex items-center justify-center space-x-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-2 border-t border-surface-border bg-surface/50">
        <div className="flex items-center space-x-1.5 bg-background border border-surface-border rounded-lg px-2.5 py-1.5">
          <input
            type="text"
            placeholder="Ask AI anything..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="p-1 text-primary hover:text-primary-hover disabled:text-muted transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
