"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileText,
  Search,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  X,
  ExternalLink,
} from "lucide-react";
import { FsItem } from "@/types";
import { TauriBridge } from "@/services/tauriBridge";

interface FileExplorerProps {
  initialPath: string;
  onClose: () => void;
  onInsertPath: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  initialPath,
  onClose,
  onInsertPath,
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [items, setItems] = useState<FsItem[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const list = await TauriBridge.listDirectory(path);
      setItems(list);
      setCurrentPath(path);
    } catch (err) {
      console.error("Failed to read directory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDirectory(initialPath);
  }, [initialPath]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getFileIcon = (item: FsItem) => {
    if (item.is_dir) return <Folder className="w-4 h-4 text-primary shrink-0" />;
    switch (item.extension.toLowerCase()) {
      case "rs":
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
      case "py":
      case "c":
      case "cpp":
        return <FileCode className="w-4 h-4 text-secondary shrink-0" />;
      case "md":
      case "txt":
      case "doc":
      case "toml":
      case "json":
        return <FileText className="w-4 h-4 text-accent shrink-0" />;
      default:
        return <File className="w-4 h-4 text-muted shrink-0" />;
    }
  };

  return (
    <aside className="w-64 h-full bg-surface border-r border-surface-border flex flex-col select-none z-30 animate-fade-in">
      {/* Header */}
      <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-foreground">
          <FolderOpen className="w-4 h-4 text-primary" />
          <span>Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => loadDirectory(currentPath)}
            className="p-1 text-muted hover:text-foreground hover:bg-surface-hover rounded"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground hover:bg-surface-hover rounded"
            title="Close Explorer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Path Breadcrumb & Search */}
      <div className="p-2 space-y-2 border-b border-surface-border">
        <div className="text-[11px] text-muted font-mono truncate" title={currentPath}>
          {currentPath}
        </div>
        <div className="relative">
          <Search className="w-3 h-3 text-muted absolute left-2 top-2" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-background text-xs pl-7 pr-2 py-1 rounded border border-surface-border outline-none text-foreground placeholder:text-muted"
          />
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-1 text-xs space-y-0.5">
        {filteredItems.map((item) => (
          <div
            key={item.path}
            onDoubleClick={() => {
              if (item.is_dir) {
                loadDirectory(item.path);
              } else {
                onInsertPath(item.path);
              }
            }}
            className="group flex items-center justify-between px-2 py-1.5 rounded hover:bg-surface-hover cursor-pointer text-foreground transition-colors"
          >
            <div className="flex items-center space-x-2 truncate">
              {getFileIcon(item)}
              <span className={`truncate ${item.is_dir ? "font-medium text-foreground" : "text-foreground/90"}`}>
                {item.name}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onInsertPath(item.path);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-primary hover:bg-surface-border rounded transition-all"
              title="Insert Path in Terminal"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-4 text-center text-xs text-muted">No files matched filter</div>
        )}
      </div>
    </aside>
  );
};
