"use client";

import React, { useState } from "react";
import { Plus, X, Pin, MoreVertical, Terminal, Copy, Columns, Rows } from "lucide-react";
import { TabItem } from "@/types";

interface TabBarProps {
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
  onRenameTab: (id: string, newTitle: string) => void;
  onDuplicateTab: (id: string) => void;
  onTogglePinTab: (id: string) => void;
  onSplitHorizontal: (tabId: string) => void;
  onSplitVertical: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onRenameTab,
  onDuplicateTab,
  onTogglePinTab,
  onSplitHorizontal,
  onSplitVertical,
}) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [contextMenuTabId, setContextMenuTabId] = useState<string | null>(null);

  const startRename = (tab: TabItem) => {
    setEditingTabId(tab.id);
    setEditTitle(tab.title);
    setContextMenuTabId(null);
  };

  const handleFinishRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameTab(id, editTitle.trim());
    }
    setEditingTabId(null);
  };

  return (
    <div className="h-9 bg-background border-b border-surface-border flex items-center px-2 space-x-1 select-none overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isEditing = tab.id === editingTabId;

        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenuTabId(contextMenuTabId === tab.id ? null : tab.id);
            }}
            className={`group relative h-7 px-3 rounded-t-md flex items-center space-x-2 text-xs cursor-pointer border-t border-x transition-all duration-200 ${
              isActive
                ? "bg-surface border-surface-border text-foreground font-medium shadow-sm"
                : "bg-transparent border-transparent text-muted hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted"}`} />

            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleFinishRename(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFinishRename(tab.id);
                  if (e.key === "Escape") setEditingTabId(null);
                }}
                autoFocus
                className="bg-surface-hover text-foreground px-1 py-0.5 rounded text-xs outline-none border border-primary w-24"
              />
            ) : (
              <span
                onDoubleClick={() => startRename(tab)}
                className="truncate max-w-[120px]"
                title="Double click to rename"
              >
                {tab.title}
              </span>
            )}

            {tab.panes.length > 1 && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-surface-border text-muted font-mono">
                {tab.panes.length}P
              </span>
            )}

            {/* Pin Badge */}
            {tab.isPinned && <Pin className="w-3 h-3 text-accent rotate-45" />}

            {/* Close Button */}
            {tabs.length > 1 && !tab.isPinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-surface-hover text-muted hover:text-danger rounded p-0.5 transition-opacity"
                title="Close Tab (Ctrl+W)"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Tab Context Menu */}
            {contextMenuTabId === tab.id && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-8 left-0 w-44 bg-surface border border-surface-border rounded-md shadow-2xl py-1 z-50 animate-fade-in text-foreground"
              >
                <button
                  onClick={() => startRename(tab)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover flex items-center space-x-2"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-muted" />
                  <span>Rename Tab</span>
                </button>
                <button
                  onClick={() => {
                    onDuplicateTab(tab.id);
                    setContextMenuTabId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover flex items-center space-x-2"
                >
                  <Copy className="w-3.5 h-3.5 text-muted" />
                  <span>Duplicate Tab</span>
                </button>
                <button
                  onClick={() => {
                    onTogglePinTab(tab.id);
                    setContextMenuTabId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover flex items-center space-x-2"
                >
                  <Pin className="w-3.5 h-3.5 text-muted" />
                  <span>{tab.isPinned ? "Unpin Tab" : "Pin Tab"}</span>
                </button>
                <div className="border-t border-surface-border my-1" />
                <button
                  onClick={() => {
                    onSplitHorizontal(tab.id);
                    setContextMenuTabId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover flex items-center space-x-2"
                >
                  <Columns className="w-3.5 h-3.5 text-muted" />
                  <span>Split Horizontally</span>
                </button>
                <button
                  onClick={() => {
                    onSplitVertical(tab.id);
                    setContextMenuTabId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover flex items-center space-x-2"
                >
                  <Rows className="w-3.5 h-3.5 text-muted" />
                  <span>Split Vertically</span>
                </button>
                {tabs.length > 1 && (
                  <>
                    <div className="border-t border-surface-border my-1" />
                    <button
                      onClick={() => {
                        onCloseTab(tab.id);
                        setContextMenuTabId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-danger/20 text-danger flex items-center space-x-2"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close Tab</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* New Tab Button */}
      <button
        onClick={onNewTab}
        className="h-7 px-2 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface rounded-md transition-colors"
        title="New Tab (Ctrl+T)"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
