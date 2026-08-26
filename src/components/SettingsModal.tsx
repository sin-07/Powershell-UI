"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Keyboard,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { ProfileConfig, ThemeConfig } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ProfileConfig[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: ProfileConfig) => void;
  onDeleteProfile: (id: string) => void;
  onExportSettings: () => void;
  onImportSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onDeleteProfile,
  onExportSettings,
  onImportSettings,
}) => {
  const [activeTab, setActiveTab] = useState<"profiles" | "shortcuts" | "export">("profiles");
  const [newProfileName, setNewProfileName] = useState("");

  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + T", desc: "Open a new terminal tab" },
    { key: "Ctrl + W", desc: "Close active terminal tab" },
    { key: "Ctrl + Shift + H", desc: "Split pane horizontally" },
    { key: "Ctrl + Shift + V", desc: "Split pane vertically" },
    { key: "Ctrl + P / F1", desc: "Open global Command Palette" },
    { key: "Ctrl + B", desc: "Toggle File Explorer sidebar" },
    { key: "Ctrl + Shift + M", desc: "Toggle Process & Resource Monitor" },
    { key: "Ctrl + Shift + A", desc: "Toggle AI Assistant drawer" },
    { key: "Ctrl + L", desc: "Clear active terminal screen" },
    { key: "Ctrl + C", desc: "Send interrupt signal to running command" },
    { key: "Ctrl + F", desc: "Search in terminal output buffer" },
  ];

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newProf: ProfileConfig = {
      id: `prof-${Date.now()}`,
      name: newProfileName.trim(),
      themeId: "cyberpunk",
      initialDir: "C:\\Users\\anike\\CODES\\AASM-Powershell",
      startupCommand: "sysinfo",
    };
    onAddProfile(newProf);
    setNewProfileName("");
  };

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
            <Settings className="w-4 h-4 text-primary" />
            <span>AASM Shell Settings & Profiles</span>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-foreground rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="h-10 border-b border-surface-border px-5 flex space-x-4 bg-background/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab("profiles")}
            className={`flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "profiles"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab("shortcuts")}
            className={`flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "shortcuts"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "export"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import / Export</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-foreground">
          {activeTab === "profiles" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="New profile name..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="flex-1 bg-background border border-surface-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none"
                />
                <button
                  onClick={handleCreateProfile}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-background font-semibold rounded-md flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Profile</span>
                </button>
              </div>

              <div className="space-y-2">
                {profiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProfile(p.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-background border-surface-border hover:bg-surface-hover"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-foreground flex items-center space-x-2">
                          <span>{p.name}</span>
                          {isActive && (
                            <span className="text-[10px] bg-primary text-background px-1.5 py-0.2 rounded font-bold uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted font-mono mt-0.5">
                          Startup: {p.startupCommand || "None"} | Dir: {p.initialDir || "Default"}
                        </div>
                      </div>

                      {profiles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProfile(p.id);
                          }}
                          className="p-1 text-muted hover:text-danger rounded"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-surface-border"
                  >
                    <span className="text-xs text-foreground/90">{sc.desc}</span>
                    <kbd className="font-mono text-xs bg-surface border border-surface-border px-2 py-1 rounded text-primary font-semibold">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div className="space-y-4 p-2">
              <p className="text-xs text-muted leading-relaxed">
                Backup your AASM Shell profiles, custom themes, aliases, and keybindings to JSON or restore from an existing configuration file.
              </p>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={onExportSettings}
                  className="flex-1 p-4 rounded-lg bg-background border border-surface-border hover:border-primary flex flex-col items-center justify-center space-y-2 text-foreground hover:text-primary transition-all group"
                >
                  <Download className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs">Export Settings (JSON)</span>
                </button>

                <button
                  onClick={onImportSettings}
                  className="flex-1 p-4 rounded-lg bg-background border border-surface-border hover:border-secondary flex flex-col items-center justify-center space-y-2 text-foreground hover:text-secondary transition-all group"
                >
                  <Upload className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs">Import Settings (JSON)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 border-t border-surface-border px-5 flex items-center justify-end bg-surface/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-surface-hover hover:bg-surface-border text-foreground font-semibold rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
