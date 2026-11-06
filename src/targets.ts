import path from "node:path";

/**
 * Destinos de instalação.
 * `visible: false` reserva o harness. Ele não entra no menu até a implementação existir.
 * Os caminhos seguem o CLI skills.sh.
 */
export type Target = {
  id: string;
  label: string;
  hint: string;
  visible: boolean;
  projectDir: string;
  globalDir: string;
};

export const targets: Record<string, Target> = {
  cursor: {
    id: "cursor",
    label: "Cursor",
    hint: "Só o Cursor",
    visible: true,
    projectDir: ".cursor/skills",
    globalDir: ".cursor/skills",
  },
  agents: {
    id: "agents",
    label: "Padrão universal (.agents)",
    hint: "Cursor também lê daqui",
    visible: true,
    projectDir: ".agents/skills",
    globalDir: ".agents/skills",
  },
  "claude-code": {
    id: "claude-code",
    label: "Claude Code",
    hint: ".claude/skills",
    visible: true,
    projectDir: ".claude/skills",
    globalDir: ".claude/skills",
  },
  codex: {
    id: "codex",
    label: "Codex",
    hint: "Mesma pasta do padrão universal",
    visible: true,
    projectDir: ".agents/skills",
    globalDir: ".agents/skills",
  },
  opencode: {
    id: "opencode",
    label: "OpenCode",
    hint: "No repositório, .agents/skills; na home, ~/.config/opencode/skills",
    visible: true,
    projectDir: ".agents/skills",
    globalDir: ".config/opencode/skills",
  },
  devin: {
    id: "devin",
    label: "Devin",
    hint: "Ainda não disponível",
    visible: false,
    projectDir: ".devin/skills",
    globalDir: ".config/devin/skills",
  },
  windsurf: {
    id: "windsurf",
    label: "Windsurf",
    hint: "Ainda não disponível",
    visible: false,
    projectDir: ".windsurf/skills",
    globalDir: ".codeium/windsurf/skills",
  },
  amp: {
    id: "amp",
    label: "Amp",
    hint: "Ainda não disponível",
    visible: false,
    projectDir: ".agents/skills",
    globalDir: ".config/agents/skills",
  },
  pi: {
    id: "pi",
    label: "Pi",
    hint: "Ainda não disponível",
    visible: false,
    projectDir: ".agents/skills",
    globalDir: ".agents/skills",
  },
};

export function visibleTargets(): Target[] {
  return Object.values(targets).filter((target) => target.visible);
}

export function resolveDestination(
  targetId: string,
  { scope, cwd, home }: { scope: string; cwd: string; home: string },
): string {
  const target = targets[targetId];
  if (!target) {
    throw new Error(`Destino desconhecido: ${targetId}`);
  }
  if (!target.visible) {
    throw new Error(`Destino ainda não disponível: ${targetId}`);
  }
  if (scope !== "project" && scope !== "global") {
    throw new Error(`Escopo desconhecido: ${scope}`);
  }

  const root = scope === "global" ? home : cwd;
  const relative = scope === "global" ? target.globalDir : target.projectDir;
  return path.resolve(root, relative);
}
