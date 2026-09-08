import { FsItem, ProcessItem, SafetyWarning, SystemMetrics } from "@/types";

declare global {
  interface Window {
    __TAURI__?: {
      invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
      event?: {
        listen: (event: string, handler: (e: { payload: unknown }) => void) => Promise<() => void>;
        emit: (event: string, payload?: unknown) => Promise<void>;
      };
    };
  }
}

export class TauriBridge {
  static isTauri(): boolean {
    return typeof window !== "undefined" && Boolean(window.__TAURI__);
  }

  static async invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    if (this.isTauri() && window.__TAURI__) {
      try {
        return (await window.__TAURI__.invoke(cmd, args)) as T;
      } catch (err) {
        console.error(`Tauri invoke error on ${cmd}:`, err);
        throw err;
      }
    }

    // Fallback simulation for Next.js preview / dev environment
    return this.mockInvoke<T>(cmd, args);
  }

  static async getSystemMetrics(): Promise<SystemMetrics> {
    return this.invoke<SystemMetrics>("get_system_metrics");
  }

  static async listProcesses(query?: string): Promise<ProcessItem[]> {
    return this.invoke<ProcessItem[]>("list_system_processes", { query });
  }

  static async killProcess(pid: number): Promise<boolean> {
    return this.invoke<boolean>("kill_system_process", { pid });
  }

  static async listDirectory(path: string): Promise<FsItem[]> {
    return this.invoke<FsItem[]>("fs_list_directory", { path });
  }

  static async executeShellCommand(
    command: string,
    cwd?: string
  ): Promise<{ stdout: string; stderr: string; exit_code: number }> {
    return this.invoke<{ stdout: string; stderr: string; exit_code: number }>(
      "execute_shell_command",
      { command, cwd }
    );
  }

  static checkCommandSafety(command: string): SafetyWarning {
    const cmd = command.trim().toLowerCase();
    if (
      cmd.startsWith("rm -r") ||
      cmd.startsWith("rm -rf") ||
      cmd.startsWith("del /s") ||
      cmd.startsWith("rd /s") ||
      cmd.startsWith("format")
    ) {
      return {
        is_dangerous: true,
        severity: "critical",
        message: "This command deletes files or directories recursively across the filesystem.",
        command,
      };
    }
    if (cmd.startsWith("taskkill /f") || cmd.startsWith("kill -f")) {
      return {
        is_dangerous: true,
        severity: "high",
        message: "This command forcibly terminates system processes.",
        command,
      };
    }
    return {
      is_dangerous: false,
      severity: "low",
      message: "Safe command.",
      command,
    };
  }

  private static async mockInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    switch (cmd) {
      case "get_system_metrics": {
        const cpu = Math.round((15 + Math.random() * 20) * 10) / 10;
        const total = 16384;
        const used = Math.round(7200 + Math.random() * 800);
        return {
          cpu_usage: cpu,
          total_memory_mb: total,
          used_memory_mb: used,
          free_memory_mb: total - used,
          process_count: 184 + Math.floor(Math.random() * 6),
          uptime_seconds: 78420,
          disks: [
            { name: "Local Disk (C:)", mount_point: "C:\\", total_gb: 512, available_gb: 284.4 },
            { name: "Secondary (D:)", mount_point: "D:\\", total_gb: 1024, available_gb: 642.1 },
          ],
        } as T;
      }
      case "list_system_processes": {
        const query = (args?.query as string | undefined)?.toLowerCase() || "";
        const mockList: ProcessItem[] = [
          { pid: 1420, name: "aasm.exe", memory_mb: 28.4, cpu_usage: 1.2, status: "Running" },
          { pid: 2180, name: "cargo.exe", memory_mb: 84.1, cpu_usage: 4.8, status: "Running" },
          { pid: 3412, name: "node.exe", memory_mb: 142.6, cpu_usage: 2.1, status: "Running" },
          { pid: 4890, name: "rustc.exe", memory_mb: 312.0, cpu_usage: 12.4, status: "Running" },
          { pid: 5120, name: "explorer.exe", memory_mb: 98.2, cpu_usage: 0.4, status: "Running" },
          { pid: 6780, name: "git.exe", memory_mb: 18.5, cpu_usage: 0.1, status: "Idle" },
          { pid: 7890, name: "code.exe", memory_mb: 480.0, cpu_usage: 3.5, status: "Running" },
          { pid: 9102, name: "chrome.exe", memory_mb: 620.0, cpu_usage: 5.2, status: "Running" },
          { pid: 11200, name: "terminal.exe", memory_mb: 42.0, cpu_usage: 0.8, status: "Running" },
        ];
        if (!query) return mockList as T;
        return mockList.filter(
          (p) => p.name.toLowerCase().includes(query) || p.pid.toString().includes(query)
        ) as T;
      }
      case "kill_system_process":
        return true as T;
      case "fs_list_directory": {
        const path = (args?.path as string) || "C:\\Users\\anike\\CODES\\AASM-Powershell";
        return [
          { name: "src", path: `${path}\\src`, is_dir: true, size_bytes: 0, modified: "2026-08-27 00:04", extension: "" },
          { name: "tests", path: `${path}\\tests`, is_dir: true, size_bytes: 0, modified: "2026-08-26 23:40", extension: "" },
          { name: "ui", path: `${path}\\ui`, is_dir: true, size_bytes: 0, modified: "2026-08-27 00:05", extension: "" },
          { name: "target", path: `${path}\\target`, is_dir: true, size_bytes: 0, modified: "2026-08-26 23:53", extension: "" },
          { name: "Cargo.toml", path: `${path}\\Cargo.toml`, is_dir: false, size_bytes: 580, modified: "2026-08-27 00:03", extension: "toml" },
          { name: "Cargo.lock", path: `${path}\\Cargo.lock`, is_dir: false, size_bytes: 32800, modified: "2026-08-27 00:03", extension: "lock" },
          { name: "README.md", path: `${path}\\README.md`, is_dir: false, size_bytes: 14100, modified: "2026-08-26 23:48", extension: "md" },
        ] as T;
      }
      default:
        return {} as T;
    }
  }
}
