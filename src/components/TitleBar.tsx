"use client";

import React from "react";
import {
  Terminal,
  Columns,
  Rows,
  Activity,
  FolderTree,
  Sparkles,
  Palette,
  Settings,
  Search,
  Minus,
  Square,
  X,
} from "lucide-react";

interface TitleBarProps {
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
  onToggleProcessMonitor: () => void;
  showProcessMonitor: boolean;
  onToggleFileExplorer: () => void;
  showFileExplorer: boolean;
  onToggleAi: () => void;
  showAi: boolean;
  onOpenCommandPalette: () => void;
  onOpenThemeCustomizer: () => void;
  onOpenSettings: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onSplitHorizontal,
  onSplitVertical,
  onToggleProcessMonitor,
  showProcessMonitor,
  onToggleFileExplorer,
  showFileExplorer,
  onToggleAi,
  showAi,
  onOpenCommandPalette,
  onOpenThemeCustomizer,
  onOpenSettings,
}) => {
  return (
    <header className="h-10 bg-surface border-b border-surface-border flex items-center justify-between px-3 select-none z-50">
      {/* Brand & Left Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-primary font-bold text-sm tracking-wider">
          <div className="w-5 h-5 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span>AASM</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
            PRO
          </span>
        </div>

        {/* Global Search / Command Palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 text-xs bg-surface-hover hover:bg-surface-border text-muted hover:text-foreground px-2.5 py-1 rounded-md transition-colors border border-surface-border"
          title="Open Command Palette (Ctrl+P / F1)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search / Commands...</span>
          <kbd className="hidden sm:inline text-[10px] bg-background px-1.5 py-0.5 rounded border border-surface-border text-muted">
            Ctrl+P
          </kbd>
        </button>
      </div>

      {/* Center Tool Buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onToggleFileExplorer}
          className={`p-1.5 rounded-md transition-colors ${
            showFileExplorer
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
          title="Toggle File Explorer (Ctrl+B)"
        >
          <FolderTree className="w-4 h-4" />
        </button>

        <button
          onClick={onSplitHorizontal}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title="Split Pane Horizontally (Ctrl+Shift+H)"
        >
          <Columns className="w-4 h-4" />
        </button>

        <button
          onClick={onSplitVertical}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title="Split Pane Vertically (Ctrl+Shift+V)"
        >
          <Rows className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleProcessMonitor}
          className={`p-1.5 rounded-md transition-colors ${
            showProcessMonitor
              ? "bg-secondary/20 text-secondary border border-secondary/30"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
          title="Toggle Process & Resource Monitor (Ctrl+Shift+M)"
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleAi}
          className={`p-1.5 rounded-md transition-colors ${
            showAi
              ? "bg-accent/20 text-accent border border-accent/30"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
          title="Toggle AI Assistant (Ctrl+Shift+A)"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenThemeCustomizer}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title="Customize Theme & Appearance"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title="Profiles & Settings (Ctrl+,)"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Right Window Controls */}
      <div className="flex items-center space-x-1">
        <button
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
          title="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-white hover:bg-danger rounded transition-colors"
          title="Close Window"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
