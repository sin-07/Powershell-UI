import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command = (body.command || "").trim();

    if (!command) {
      return NextResponse.json({ stdout: "", stderr: "Empty command", exit_code: 0 });
    }

    // Safety guard against fork bombs or dangerous system calls
    const lower = command.toLowerCase();
    if (lower.includes(":(){ :|:& };:") || lower.includes("mkfs") || lower.includes("dd if=/dev/zero")) {
      return NextResponse.json({
        stdout: "",
        stderr: "Command blocked by security policy.",
        exit_code: 1,
      });
    }

    const { stdout, stderr } = await execAsync(command, {
      timeout: 8000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, TERM: "dumb" },
    });

    return NextResponse.json({
      stdout: stdout || "",
      stderr: stderr || "",
      exit_code: 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      stdout: err.stdout || "",
      stderr: err.stderr || err.message || "Execution error",
      exit_code: typeof err.code === "number" ? err.code : 1,
    });
  }
}
