"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { ProcessItem, SystemMetrics } from "@/types";
import { TauriBridge } from "@/services/tauriBridge";

interface ProcessMonitorProps {
  onClose: () => void;
}

export const ProcessMonitor: React.FC<ProcessMonitorProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [killConfirmPid, setKillConfirmPid] = useState<number | null>(null);

  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      const m = await TauriBridge.getSystemMetrics();
      const p = await TauriBridge.listProcesses(filter);
      setMetrics(m);
      setProcesses(p);
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleKill = async (pid: number) => {
    try {
      await TauriBridge.killProcess(pid);
      setKillConfirmPid(null);
      fetchTelemetry();
    } catch (err) {
      console.error("Failed to kill process:", err);
    }
  };

  const memPercent = metrics
    ? Math.round((metrics.used_memory_mb / metrics.total_memory_mb) * 100)
    : 0;

  return (
    <div className="w-80 h-full bg-surface border-l border-surface-border flex flex-col select-none z-30 animate-fade-in">
      {/* Header */}
      <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-foreground">
          <Activity className="w-4 h-4 text-secondary" />
          <span>System & Tasks</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={fetchTelemetry}
            className="p-1 text-muted hover:text-foreground hover:bg-surface-hover rounded"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground hover:bg-surface-hover rounded"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-surface-border">
        {/* CPU Card */}
        <div className="bg-background/80 p-2.5 rounded-md border border-surface-border">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-primary" />
              <span>CPU</span>
            </span>
            <span className="font-mono text-foreground font-bold">{metrics?.cpu_usage || 0}%</span>
          </div>
          <div className="w-full bg-surface-border h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${Math.min(100, metrics?.cpu_usage || 0)}%` }}
            />
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-background/80 p-2.5 rounded-md border border-surface-border">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-secondary" />
              <span>RAM</span>
            </span>
            <span className="font-mono text-foreground font-bold">{memPercent}%</span>
          </div>
          <div className="w-full bg-surface-border h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-300"
              style={{ width: `${memPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Disk Status */}
      {metrics?.disks && metrics.disks.length > 0 && (
        <div className="px-3 py-2 border-b border-surface-border space-y-1.5">
          {metrics.disks.map((d) => (
            <div key={d.mount_point} className="flex items-center justify-between text-[11px] text-muted">
              <span className="flex items-center space-x-1 font-mono">
                <HardDrive className="w-3 h-3 text-accent" />
                <span>{d.name}</span>
              </span>
              <span className="font-mono">
                {d.available_gb} GB free / {d.total_gb} GB
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Process Filter */}
      <div className="p-2 border-b border-surface-border">
        <div className="relative">
          <Search className="w-3 h-3 text-muted absolute left-2 top-2" />
          <input
            type="text"
            placeholder="Search processes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-background text-xs pl-7 pr-2 py-1 rounded border border-surface-border outline-none text-foreground placeholder:text-muted"
          />
        </div>
      </div>

      {/* Process List Table */}
      <div className="flex-1 overflow-y-auto text-xs p-1 space-y-0.5">
        <div className="px-2 py-1 text-[10px] text-muted font-bold flex justify-between uppercase">
          <span>Process</span>
          <span>RAM / Action</span>
        </div>

        {processes.map((proc) => (
          <div
            key={proc.pid}
            className="group flex items-center justify-between px-2 py-1 rounded hover:bg-surface-hover transition-colors"
          >
            <div className="truncate flex-1 pr-2">
              <div className="text-foreground font-medium truncate">{proc.name}</div>
              <div className="text-[10px] text-muted font-mono">PID: {proc.pid}</div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-muted">{proc.memory_mb} MB</span>
              <button
                onClick={() => setKillConfirmPid(proc.pid)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-danger hover:bg-danger/10 rounded transition-all"
                title={`Terminate PID ${proc.pid}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kill Confirmation Modal */}
      {killConfirmPid !== null && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-surface-border rounded-lg p-4 max-w-xs space-y-3 shadow-2xl animate-fade-in">
            <div className="flex items-center space-x-2 text-danger font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Terminate Process?</span>
            </div>
            <p className="text-xs text-muted">
              Are you sure you want to forcibly terminate process PID <b>{killConfirmPid}</b>?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setKillConfirmPid(null)}
                className="px-3 py-1 text-xs rounded bg-surface-hover hover:bg-surface-border text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => handleKill(killConfirmPid)}
                className="px-3 py-1 text-xs rounded bg-danger hover:bg-danger/80 text-white font-semibold"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
