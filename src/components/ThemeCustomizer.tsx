"use client";

import React from "react";
import { Palette, Sparkles, Sliders, Type, MousePointer, X, Check } from "lucide-react";
import { PromptConfig, ThemeConfig } from "@/types";

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onUpdateTheme: (theme: ThemeConfig) => void;
  promptConfig: PromptConfig;
  onUpdatePromptConfig: (config: PromptConfig) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onUpdateTheme,
  promptConfig,
  onUpdatePromptConfig,
}) => {
  if (!isOpen) return null;

  const presetThemes: { id: string; name: string; bg: string; primary: string; secondary: string }[] = [
    { id: "cyberpunk", name: "Cyberpunk Neon", bg: "#090a10", primary: "#00f0ff", secondary: "#ff007f" },
    { id: "tokyo-night", name: "Tokyo Night", bg: "#1a1b26", primary: "#7aa2f7", secondary: "#bb9af7" },
    { id: "dracula", name: "Dracula Classic", bg: "#282a36", primary: "#bd93f9", secondary: "#ff79c6" },
    { id: "monokai", name: "Monokai Pro", bg: "#272822", primary: "#a6e22e", secondary: "#ae81ff" },
    { id: "synthwave", name: "Synthwave '84", bg: "#241b2f", primary: "#03edf9", secondary: "#ff7edb" },
    { id: "nord", name: "Arctic Nord", bg: "#2e3440", primary: "#88c0d0", secondary: "#81a1c1" },
    { id: "oled", name: "Pure OLED Black", bg: "#000000", primary: "#ffffff", secondary: "#a3a3a3" },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-down"
      >
        {/* Header */}
        <div className="h-12 border-b border-surface-border px-5 flex items-center justify-between bg-surface/50">
          <div className="flex items-center space-x-2 text-sm font-bold text-foreground">
            <Palette className="w-4 h-4 text-primary" />
            <span>Theme & Terminal Customizer</span>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-foreground rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customizer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-foreground">
          {/* Preset Themes Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Color Themes</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presetThemes.map((preset) => {
                const isSelected = currentTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onUpdateTheme({ ...currentTheme, id: preset.id, name: preset.name })}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between space-y-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                        : "border-surface-border bg-background hover:bg-surface-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground truncate">{preset.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>

                    <div className="flex space-x-1.5 pt-1">
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography & Cursor */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
              <Type className="w-3.5 h-3.5 text-secondary" />
              <span>Typography & Cursor</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Font Family */}
              <div>
                <label className="block text-[11px] text-muted mb-1 font-medium">Font Family</label>
                <select
                  value={currentTheme.fontFamily}
                  onChange={(e) => onUpdateTheme({ ...currentTheme, fontFamily: e.target.value })}
                  className="w-full bg-background border border-surface-border rounded-md px-2.5 py-1.5 text-xs text-foreground outline-none"
                >
                  <option value="Consolas, monospace">Consolas</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="'Cascadia Code', monospace">Cascadia Code</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-[11px] text-muted mb-1 font-medium">Font Size: {currentTheme.fontSize}px</label>
                <input
                  type="range"
                  min="11"
                  max="22"
                  step="1"
                  value={currentTheme.fontSize}
                  onChange={(e) => onUpdateTheme({ ...currentTheme, fontSize: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              {/* Cursor Style */}
              <div>
                <label className="block text-[11px] text-muted mb-1 font-medium">Cursor Style</label>
                <select
                  value={currentTheme.cursorStyle}
                  onChange={(e) => onUpdateTheme({ ...currentTheme, cursorStyle: e.target.value as "block" | "underline" | "bar" })}
                  className="w-full bg-background border border-surface-border rounded-md px-2.5 py-1.5 text-xs text-foreground outline-none"
                >
                  <option value="block">Block █</option>
                  <option value="underline">Underline  _</option>
                  <option value="bar">Bar |</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prompt Segments Customizer */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-accent" />
              <span>Prompt Segments</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-background border border-surface-border cursor-pointer hover:bg-surface-hover">
                <input
                  type="checkbox"
                  checked={promptConfig.showCwd}
                  onChange={(e) => onUpdatePromptConfig({ ...promptConfig, showCwd: e.target.checked })}
                  className="rounded accent-primary"
                />
                <span className="text-xs">Current Working Directory</span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-background border border-surface-border cursor-pointer hover:bg-surface-hover">
                <input
                  type="checkbox"
                  checked={promptConfig.showGitBranch}
                  onChange={(e) => onUpdatePromptConfig({ ...promptConfig, showGitBranch: e.target.checked })}
                  className="rounded accent-primary"
                />
                <span className="text-xs">Git Branch Status Badge</span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-background border border-surface-border cursor-pointer hover:bg-surface-hover">
                <input
                  type="checkbox"
                  checked={promptConfig.showExitCode}
                  onChange={(e) => onUpdatePromptConfig({ ...promptConfig, showExitCode: e.target.checked })}
                  className="rounded accent-primary"
                />
                <span className="text-xs">Exit Code Status Badge</span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-background border border-surface-border cursor-pointer hover:bg-surface-hover">
                <input
                  type="checkbox"
                  checked={promptConfig.showTimestamp}
                  onChange={(e) => onUpdatePromptConfig({ ...promptConfig, showTimestamp: e.target.checked })}
                  className="rounded accent-primary"
                />
                <span className="text-xs">Command Execution Time</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 border-t border-surface-border px-5 flex items-center justify-end bg-surface/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-primary hover:bg-primary-hover text-background font-semibold rounded-md transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
