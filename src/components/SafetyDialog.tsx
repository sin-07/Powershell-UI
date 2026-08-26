"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, X, Check } from "lucide-react";
import { SafetyWarning } from "@/types";

interface SafetyDialogProps {
  warning: SafetyWarning | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyDialog: React.FC<SafetyDialogProps> = ({
  warning,
  onConfirm,
  onCancel,
}) => {
  if (!warning || !warning.is_dangerous) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-danger/40 rounded-xl shadow-2xl overflow-hidden p-5 space-y-4 animate-slide-down">
        {/* Warning Header */}
        <div className="flex items-center space-x-3 text-danger">
          <div className="p-2 bg-danger/20 rounded-lg border border-danger/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Security Guardrail Triggered</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-danger/20 text-danger border border-danger/30">
              {warning.severity} Risk
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-foreground/90 leading-relaxed">
          {warning.message}
        </p>

        {/* Command Display */}
        <div className="bg-background font-mono text-xs text-danger p-2.5 rounded-md border border-danger/30 break-all select-text">
          {warning.command}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-md bg-surface-hover hover:bg-surface-border text-foreground transition-colors"
          >
            Cancel / Abort
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs rounded-md bg-danger hover:bg-danger/80 text-white font-bold transition-colors flex items-center space-x-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Execute Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
};
