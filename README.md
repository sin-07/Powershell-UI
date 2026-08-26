# AASM Shell UI - Modern Desktop Terminal Frontend

**AASM Shell UI** is a production-grade desktop terminal interface built with **Next.js 14, React 18, TypeScript, and Tailwind CSS**. Designed for the **AASM Shell** engine and Tauri IPC bridge.

---

## Key Features

- **Multi-Tab & Split-Pane Workspace**:
  - Open unlimited tabs (`Ctrl+T`), duplicate, pin, rename, and close tabs (`Ctrl+W`).
  - Horizontal (`Ctrl+Shift+H`) and Vertical (`Ctrl+Shift+V`) split panes with multi-terminal focus.
- **Interactive Terminal Canvas**:
  - Full ANSI 16-color & 256-color stream rendering.
  - Custom prompt system with Git branch status, current working directory, execution timer, and exit code badge.
  - Search in terminal buffer (`Ctrl+F`), copy buffer, clear screen (`Ctrl+L`), and send process interrupts (`Ctrl+C`).
  - TAB autocomplete with visual suggestions popup.
- **Integrated File Explorer (`Ctrl+B`)**:
  - Collapsible file tree sidebar with live directory navigation, file type icons, search filter, and quick path insertion.
- **Real-Time Process & Resource Monitor (`Ctrl+Shift+M`)**:
  - Live CPU Load %, RAM Usage %, and Disks Free % telemetry.
  - Process table with real-time search, sorting by memory/CPU, and force-kill button.
- **Global Command Palette (`Ctrl+P` / `F1`)**:
  - Spotlight-style fuzzy search popup for rapid navigation, action triggers, theme switching, and tools.
- **Theme Engine & Appearance Customizer**:
  - 7 preset themes: *Cyberpunk Neon, Tokyo Night, Dracula, Monokai Pro, Synthwave '84, Arctic Nord, Pure OLED Black*.
  - Live theme customizer for font family, font size stepper, cursor style (block, underline, bar), opacity, and prompt segment toggles.
- **AI Assistant Intelligence Drawer (`Ctrl+Shift+A`)**:
  - Natural language to shell command generator.
  - Command explanation, syntax breakdown, and error diagnosis.
- **Profiles & Settings (`Ctrl+,`)**:
  - Multi-profile management (startup command, custom working directory, custom environment variables).
  - Config import and export to JSON.
- **Security Guardrails**:
  - Automatic interception of high-risk commands (recursive deletion, partition alterations, task terminations) with user confirmation modal.

---

## Getting Started

### Development Mode

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the terminal UI in your browser.

### Production Build

```bash
npm run build
```

This compiles static assets into `dist/` ready for Tauri desktop embedding.
