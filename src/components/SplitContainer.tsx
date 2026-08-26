"use client";

import React from "react";
import { PaneItem, PromptConfig, ThemeConfig } from "@/types";
import { TerminalPane } from "./TerminalPane";

interface SplitContainerProps {
  panes: PaneItem[];
  activePaneId: string;
  theme: ThemeConfig;
  promptConfig: PromptConfig;
  onSelectPane: (paneId: string) => void;
  onClosePane: (paneId: string) => void;
  onRunSafetyCheck?: (command: string, onConfirm: () => void) => void;
  onAskAiForCommand?: (command: string) => void;
}

export const SplitContainer: React.FC<SplitContainerProps> = ({
  panes,
  activePaneId,
  theme,
  promptConfig,
  onSelectPane,
  onClosePane,
  onRunSafetyCheck,
  onAskAiForCommand,
}) => {
  if (panes.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted">No active panes</div>;
  }

  if (panes.length === 1) {
    return (
      <div className="h-full w-full">
        <TerminalPane
          pane={panes[0]}
          theme={theme}
          promptConfig={promptConfig}
          isActive={panes[0].id === activePaneId}
          onFocus={() => onSelectPane(panes[0].id)}
          onClose={panes.length > 1 ? () => onClosePane(panes[0].id) : undefined}
          onRunSafetyCheck={onRunSafetyCheck}
          onAskAiForCommand={onAskAiForCommand}
        />
      </div>
    );
  }

  // Multi-pane split view
  const isVertical = panes[0].splitDirection === "vertical";

  return (
    <div className={`h-full w-full flex ${isVertical ? "flex-col" : "flex-row"} gap-1 bg-surface-border p-1`}>
      {panes.map((pane) => (
        <div key={pane.id} className="flex-1 h-full min-h-[150px] min-w-[200px] overflow-hidden">
          <TerminalPane
            pane={pane}
            theme={theme}
            promptConfig={promptConfig}
            isActive={pane.id === activePaneId}
            onFocus={() => onSelectPane(pane.id)}
            onClose={() => onClosePane(pane.id)}
            onRunSafetyCheck={onRunSafetyCheck}
            onAskAiForCommand={onAskAiForCommand}
          />
        </div>
      ))}
    </div>
  );
};
