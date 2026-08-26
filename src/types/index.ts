export interface TabItem {
  id: string;
  title: string;
  panes: PaneItem[];
  activePaneId: string;
  isPinned?: boolean;
}

export interface PaneItem {
  id: string;
  sessionId: string;
  title: string;
  cwd: string;
  isFocused: boolean;
  profileId?: string;
  splitDirection?: "horizontal" | "vertical";
  size?: number; // percentage width/height
}

export interface TerminalOutputLine {
  id: string;
  type: "stdout" | "stderr" | "input" | "system" | "prompt";
  text: string;
  timestamp: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  background: string;
  foreground: string;
  surface: string;
  surfaceHover: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  danger: string;
  warning: string;
  success: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  cursorStyle: "block" | "underline" | "bar";
  cursorBlink: boolean;
  opacity: number;
  blur: number;
}

export interface PromptConfig {
  style: "default" | "cwd" | "starship" | "minimal" | "cyber";
  symbol: string;
  showGitBranch: boolean;
  showCwd: boolean;
  showTimestamp: boolean;
  showExitCode: boolean;
  showSystemBadge: boolean;
}

export interface ProfileConfig {
  id: string;
  name: string;
  initialDir?: string;
  startupCommand?: string;
  themeId: string;
  envVars?: Record<string, string>;
  isDefault?: boolean;
}

export interface SystemMetrics {
  cpu_usage: number;
  total_memory_mb: number;
  used_memory_mb: number;
  free_memory_mb: number;
  process_count: number;
  uptime_seconds: number;
  disks: DiskInfo[];
}

export interface DiskInfo {
  name: string;
  mount_point: string;
  total_gb: number;
  available_gb: number;
}

export interface ProcessItem {
  pid: number;
  name: string;
  memory_mb: number;
  cpu_usage: number;
  status: string;
}

export interface FsItem {
  name: string;
  path: string;
  is_dir: boolean;
  size_bytes: number;
  modified: string;
  extension: string;
}

export interface SafetyWarning {
  is_dangerous: boolean;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  command: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  suggestedCommand?: string;
  timestamp: number;
}
