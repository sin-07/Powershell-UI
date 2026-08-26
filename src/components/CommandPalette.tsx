"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Terminal,
  Columns,
  Rows,
  Plus,
  Palette,
  Settings,
  Sparkles,
  Activity,
  FolderTree,
  Trash2,
  X,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Actions" | "Themes" | "Tools" | "Commands";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: string) => void;
  onNewTab: () => void;
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
  onClearBuffer: () => void;
  onToggleFileExplorer: () => void;
  onToggleProcessMonitor: () => void;
  onToggleAi: () => void;
  onOpenSettings: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTheme,
  onNewTab,
  onSplitHorizontal,
  onSplitVertical,
  onClearBuffer,
  onToggleFileExplorer,
  onToggleProcessMonitor,
  onToggleAi,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: "new-tab",
      title: "New Terminal Tab",
      category: "Actions",
      icon: <Plus className="w-4 h-4 text-primary" />,
      shortcut: "Ctrl+T",
      action: () => { onNewTab(); onClose(); },
    },
    {
      id: "split-h",
      title: "Split Pane Horizontally",
      category: "Actions",
      icon: <Columns className="w-4 h-4 text-primary" />,
      shortcut: "Ctrl+Shift+H",
      action: () => { onSplitHorizontal(); onClose(); },
    },
    {
      id: "split-v",
      title: "Split Pane Vertically",
      category: "Actions",
      icon: <Rows className="w-4 h-4 text-primary" />,
      shortcut: "Ctrl+Shift+V",
      action: () => { onSplitVertical(); onClose(); },
    },
    {
      id: "clear-term",
      title: "Clear Active Terminal Screen",
      category: "Actions",
      icon: <Trash2 className="w-4 h-4 text-muted" />,
      shortcut: "Ctrl+L",
      action: () => { onClearBuffer(); onClose(); },
    },
    {
      id: "toggle-explorer",
      title: "Toggle File Explorer Sidebar",
      category: "Tools",
      icon: <FolderTree className="w-4 h-4 text-primary" />,
      shortcut: "Ctrl+B",
      action: () => { onToggleFileExplorer(); onClose(); },
    },
    {
      id: "toggle-monitor",
      title: "Toggle Process & Resource Monitor",
      category: "Tools",
      icon: <Activity className="w-4 h-4 text-secondary" />,
      shortcut: "Ctrl+Shift+M",
      action: () => { onToggleProcessMonitor(); onClose(); },
    },
    {
      id: "toggle-ai",
      title: "Toggle AI Assistant Intelligence Drawer",
      category: "Tools",
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      shortcut: "Ctrl+Shift+A",
      action: () => { onToggleAi(); onClose(); },
    },
    {
      id: "open-settings",
      title: "Open Profiles & Settings",
      category: "Tools",
      icon: <Settings className="w-4 h-4 text-muted" />,
      shortcut: "Ctrl+,",
      action: () => { onOpenSettings(); onClose(); },
    },
    // Themes
    {
      id: "theme-cyberpunk",
      title: "Theme: Cyberpunk Neon 2077",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-primary" />,
      action: () => { onSelectTheme("cyberpunk"); onClose(); },
    },
    {
      id: "theme-tokyonight",
      title: "Theme: Tokyo Night Dark",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-secondary" />,
      action: () => { onSelectTheme("tokyo-night"); onClose(); },
    },
    {
      id: "theme-dracula",
      title: "Theme: Dracula Classic",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-accent" />,
      action: () => { onSelectTheme("dracula"); onClose(); },
    },
    {
      id: "theme-monokai",
      title: "Theme: Monokai Pro Amber",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-success" />,
      action: () => { onSelectTheme("monokai"); onClose(); },
    },
    {
      id: "theme-synthwave",
      title: "Theme: Synthwave '84 Sunset",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-secondary" />,
      action: () => { onSelectTheme("synthwave"); onClose(); },
    },
    {
      id: "theme-nord",
      title: "Theme: Arctic Nord Frost",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-primary" />,
      action: () => { onSelectTheme("nord"); onClose(); },
    },
    {
      id: "theme-oled",
      title: "Theme: Pure OLED Black",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-foreground" />,
      action: () => { onSelectTheme("oled"); onClose(); },
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/70 backdrop-blur-md flex items-start justify-center pt-24 z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-down"
      >
        {/* Search Input */}
        <div className="h-12 border-b border-surface-border flex items-center px-4 space-x-3 bg-surface/50">
          <Search className="w-4 h-4 text-primary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
          <kbd className="text-[10px] bg-surface-hover px-1.5 py-0.5 rounded border border-surface-border text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected ? "bg-primary/20 text-foreground border border-primary/30" : "hover:bg-surface-hover text-foreground/90"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  {item.icon}
                  <span className="text-xs font-medium truncate">{item.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-border text-muted font-sans uppercase">
                    {item.category}
                  </span>
                </div>

                {item.shortcut && (
                  <kbd className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-surface-border text-muted">
                    {item.shortcut}
                  </kbd>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-muted">
              No matching commands or actions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
