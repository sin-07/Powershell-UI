"use client";

import React, { useState, useEffect } from "react";
import { PaneItem, ProfileConfig, PromptConfig, SafetyWarning, TabItem, ThemeConfig } from "@/types";
import { TitleBar } from "@/components/TitleBar";
import { TabBar } from "@/components/TabBar";
import { SplitContainer } from "@/components/SplitContainer";
import { FileExplorer } from "@/components/FileExplorer";
import { ProcessMonitor } from "@/components/ProcessMonitor";
import { AiAssistantDrawer } from "@/components/AiAssistantDrawer";
import { CommandPalette } from "@/components/CommandPalette";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { SettingsModal } from "@/components/SettingsModal";
import { SafetyDialog } from "@/components/SafetyDialog";

const defaultTheme: ThemeConfig = {
  id: "cyberpunk",
  name: "Cyberpunk Neon",
  background: "#090a10",
  foreground: "#f0f6fc",
  surface: "#121420",
  surfaceHover: "#1c2035",
  border: "#2e3856",
  primary: "#00f0ff",
  secondary: "#ff007f",
  accent: "#ffe600",
  danger: "#ff0055",
  warning: "#facc15",
  success: "#00ff88",
  fontFamily: "'Fira Code', Consolas, monospace",
  fontSize: 13,
  lineHeight: 1.5,
  cursorStyle: "block",
  cursorBlink: true,
  opacity: 0.95,
  blur: 16,
};

const defaultPromptConfig: PromptConfig = {
  style: "default",
  symbol: "AASM>",
  showGitBranch: true,
  showCwd: true,
  showTimestamp: false,
  showExitCode: true,
  showSystemBadge: true,
};

const initialProfiles: ProfileConfig[] = [
  {
    id: "prof-1",
    name: "Default (Rust Core)",
    themeId: "cyberpunk",
    initialDir: "C:\\Users\\anike\\CODES\\AASM-Powershell",
    startupCommand: "sysinfo",
    isDefault: true,
  },
  {
    id: "prof-2",
    name: "Developer Workspace",
    themeId: "tokyo-night",
    initialDir: "C:\\Users\\anike\\CODES",
    startupCommand: "dir -l",
  },
  {
    id: "prof-3",
    name: "Minimalist OLED",
    themeId: "oled",
    initialDir: "C:\\Users\\anike",
    startupCommand: "echo Ready",
  },
];

export default function Home() {
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: "tab-1",
      title: "Terminal 1",
      activePaneId: "pane-1",
      panes: [
        {
          id: "pane-1",
          sessionId: "session-1",
          title: "Main Terminal",
          cwd: "C:\\Users\\anike\\CODES\\AASM-Powershell",
          isFocused: true,
        },
      ],
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [promptConfig, setPromptConfig] = useState<PromptConfig>(defaultPromptConfig);
  const [profiles, setProfiles] = useState<ProfileConfig[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState("prof-1");

  // Side panels & modals
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showProcessMonitor, setShowProcessMonitor] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [safetyWarning, setSafetyWarning] = useState<SafetyWarning | null>(null);
  const [pendingSafeAction, setPendingSafeAction] = useState<(() => void) | null>(null);

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = `theme-${theme.id}`;
  }, [theme.id]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Tab Operations
  const handleNewTab = () => {
    const tabNum = tabs.length + 1;
    const newPaneId = `pane-${Date.now()}`;
    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      title: `Terminal ${tabNum}`,
      activePaneId: newPaneId,
      panes: [
        {
          id: newPaneId,
          sessionId: `session-${Date.now()}`,
          title: `Terminal ${tabNum}`,
          cwd: "C:\\Users\\anike\\CODES\\AASM-Powershell",
          isFocused: true,
        },
      ],
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
    }
  };

  const handleRenameTab = (id: string, newTitle: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleDuplicateTab = (id: string) => {
    const target = tabs.find((t) => t.id === id);
    if (!target) return;
    const newPaneId = `pane-${Date.now()}`;
    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      title: `${target.title} (Copy)`,
      activePaneId: newPaneId,
      panes: [
        {
          id: newPaneId,
          sessionId: `session-${Date.now()}`,
          title: `${target.title} (Copy)`,
          cwd: target.panes[0]?.cwd || "C:\\Users\\anike\\CODES\\AASM-Powershell",
          isFocused: true,
        },
      ],
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleTogglePinTab = (id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  // Split Pane Operations
  const handleSplitHorizontal = (tabId = activeTabId) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === tabId) {
          const newPaneId = `pane-${Date.now()}`;
          const newPane: PaneItem = {
            id: newPaneId,
            sessionId: `session-${Date.now()}`,
            title: `Split Pane`,
            cwd: t.panes[0]?.cwd || "C:\\Users\\anike\\CODES\\AASM-Powershell",
            isFocused: true,
            splitDirection: "horizontal",
          };
          return {
            ...t,
            panes: [...t.panes, newPane],
            activePaneId: newPaneId,
          };
        }
        return t;
      })
    );
  };

  const handleSplitVertical = (tabId = activeTabId) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === tabId) {
          const newPaneId = `pane-${Date.now()}`;
          const newPane: PaneItem = {
            id: newPaneId,
            sessionId: `session-${Date.now()}`,
            title: `Split Pane`,
            cwd: t.panes[0]?.cwd || "C:\\Users\\anike\\CODES\\AASM-Powershell",
            isFocused: true,
            splitDirection: "vertical",
          };
          return {
            ...t,
            panes: [...t.panes, newPane],
            activePaneId: newPaneId,
          };
        }
        return t;
      })
    );
  };

  const handleClosePane = (paneId: string) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.panes.some((p) => p.id === paneId)) {
          const remaining = t.panes.filter((p) => p.id !== paneId);
          return {
            ...t,
            panes: remaining.length ? remaining : t.panes,
            activePaneId: remaining[0]?.id || t.activePaneId,
          };
        }
        return t;
      })
    );
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        handleNewTab();
      } else if (e.ctrlKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        handleCloseTab(activeTabId);
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        handleSplitHorizontal();
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "v") {
        e.preventDefault();
        handleSplitVertical();
      } else if ((e.ctrlKey && e.key.toLowerCase() === "p") || e.key === "F1") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setShowFileExplorer((prev) => !prev);
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setShowProcessMonitor((prev) => !prev);
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setShowAi((prev) => !prev);
      } else if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        setShowSettings((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTabId, tabs]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Title Bar */}
      <TitleBar
        onSplitHorizontal={() => handleSplitHorizontal()}
        onSplitVertical={() => handleSplitVertical()}
        onToggleProcessMonitor={() => setShowProcessMonitor((p) => !p)}
        showProcessMonitor={showProcessMonitor}
        onToggleFileExplorer={() => setShowFileExplorer((p) => !p)}
        showFileExplorer={showFileExplorer}
        onToggleAi={() => setShowAi((p) => !p)}
        showAi={showAi}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenThemeCustomizer={() => setShowThemeCustomizer(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Tab Navigation Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onRenameTab={handleRenameTab}
        onDuplicateTab={handleDuplicateTab}
        onTogglePinTab={handleTogglePinTab}
        onSplitHorizontal={(id) => handleSplitHorizontal(id)}
        onSplitVertical={(id) => handleSplitVertical(id)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Collapsible File Explorer */}
        {showFileExplorer && (
          <FileExplorer
            initialPath={activeTab?.panes[0]?.cwd || "C:\\Users\\anike\\CODES\\AASM-Powershell"}
            onClose={() => setShowFileExplorer(false)}
            onInsertPath={(path) => {
              console.log("Insert path:", path);
            }}
          />
        )}

        {/* Center Terminal Split Container */}
        <main className="flex-1 h-full overflow-hidden bg-background">
          {activeTab && (
            <SplitContainer
              panes={activeTab.panes}
              activePaneId={activeTab.activePaneId}
              theme={theme}
              promptConfig={promptConfig}
              onSelectPane={(paneId) => {
                setTabs((prev) =>
                  prev.map((t) => (t.id === activeTab.id ? { ...t, activePaneId: paneId } : t))
                );
              }}
              onClosePane={handleClosePane}
              onRunSafetyCheck={(cmd, onConfirm) => {
                setSafetyWarning({
                  is_dangerous: true,
                  severity: "critical",
                  message: "This command deletes files or directories recursively across your filesystem.",
                  command: cmd,
                });
                setPendingSafeAction(() => onConfirm);
              }}
            />
          )}
        </main>

        {/* Right Collapsible Process & Resource Monitor */}
        {showProcessMonitor && (
          <ProcessMonitor onClose={() => setShowProcessMonitor(false)} />
        )}

        {/* Right Collapsible AI Assistant */}
        {showAi && (
          <AiAssistantDrawer
            onClose={() => setShowAi(false)}
            onRunCommand={(cmd) => {
              console.log("Run command from AI:", cmd);
            }}
            onInsertCommand={(cmd) => {
              console.log("Insert command from AI:", cmd);
            }}
          />
        )}
      </div>

      {/* Global Modals & Dialogs */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectTheme={(themeId) => setTheme((prev) => ({ ...prev, id: themeId }))}
        onNewTab={handleNewTab}
        onSplitHorizontal={() => handleSplitHorizontal()}
        onSplitVertical={() => handleSplitVertical()}
        onClearBuffer={() => {}}
        onToggleFileExplorer={() => setShowFileExplorer((p) => !p)}
        onToggleProcessMonitor={() => setShowProcessMonitor((p) => !p)}
        onToggleAi={() => setShowAi((p) => !p)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <ThemeCustomizer
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
        currentTheme={theme}
        onUpdateTheme={setTheme}
        promptConfig={promptConfig}
        onUpdatePromptConfig={setPromptConfig}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={setActiveProfileId}
        onAddProfile={(p) => setProfiles((prev) => [...prev, p])}
        onDeleteProfile={(id) => setProfiles((prev) => prev.filter((p) => p.id !== id))}
        onExportSettings={() => {
          const blob = new Blob([JSON.stringify({ profiles, theme, promptConfig }, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "aasm-settings.json";
          a.click();
        }}
        onImportSettings={() => {}}
      />

      <SafetyDialog
        warning={safetyWarning}
        onConfirm={() => {
          if (pendingSafeAction) pendingSafeAction();
          setSafetyWarning(null);
          setPendingSafeAction(null);
        }}
        onCancel={() => {
          setSafetyWarning(null);
          setPendingSafeAction(null);
        }}
      />
    </div>
  );
}
