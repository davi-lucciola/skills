import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import { discoverSkills } from "./discover.js";
import { installSkill, pathExists } from "./install.js";
import { resolveDestination, targets, visibleTargets } from "./targets.js";

const packageRoot = path.resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
);

export function parseArgs(argv) {
  const flags = {
    target: null,
    global: false,
    yes: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
    } else if (arg === "--yes" || arg === "-y") {
      flags.yes = true;
    } else if (arg === "--global" || arg === "-g") {
      flags.global = true;
    } else if (arg === "--target" || arg === "-t") {
      const value = argv[index + 1];
      if (!value || value.startsWith("-")) {
        throw new Error(
          "Informe o destino depois de --target: cursor ou agents.",
        );
      }
      flags.target = value;
      index += 1;
    } else if (arg.startsWith("--target=")) {
      flags.target = arg.slice("--target=".length);
      if (!flags.target) {
        throw new Error(
          "Informe o destino depois de --target: cursor ou agents.",
        );
      }
    } else {
      throw new Error(`Argumento desconhecido: ${arg}`);
    }
  }

  if (flags.target) {
    const target = targets[flags.target];
    if (!target) {
      throw new Error(
        `Destino desconhecido: ${flags.target}. Use cursor ou agents.`,
      );
    }
    if (!target.visible) {
      throw new Error(`Destino ainda não disponível: ${flags.target}.`);
    }
  }

  return flags;
}

export function helpText() {
  return `Uso: skills [opções]

Instala as skills deste pacote no repositório atual ou na home.

Opções:
  --target, -t cursor|agents   Destino. cursor grava em .cursor/skills.
                               agents grava em .agents/skills.
  --global, -g                 Instala na home em vez do repositório atual.
  --yes, -y                    Substitui skills existentes sem perguntar.
  --help, -h                   Mostra esta ajuda.

Sem --target, o instalador pergunta o destino e o escopo.
`;
}

function cancel() {
  p.cancel("Instalação cancelada.");
  process.exit(0);
}

async function chooseTarget(flags) {
  if (flags.target) return flags.target;
  if (!process.stdin.isTTY) {
    throw new Error("Informe --target cursor ou --target agents.");
  }

  const selected = await p.select({
    message: "Onde instalar?",
    options: visibleTargets().map((target) => ({
      value: target.id,
      label: target.label,
      hint: target.hint,
    })),
  });
  if (p.isCancel(selected)) cancel();
  return selected;
}

async function chooseScope(flags) {
  if (flags.global) return "global";
  if (!process.stdin.isTTY) return "project";

  const selected = await p.select({
    message: "Em qual escopo?",
    options: [
      {
        value: "project",
        label: "Este repositório",
        hint: process.cwd(),
      },
      {
        value: "global",
        label: "Home",
        hint: "Disponível em todos os projetos",
      },
    ],
  });
  if (p.isCancel(selected)) cancel();
  return selected;
}

async function confirmOverwrite(skillName, flags) {
  if (flags.yes) return true;
  if (!process.stdin.isTTY) {
    throw new Error(
      `${skillName} já existe no destino. Use --yes para substituir.`,
    );
  }

  const confirmed = await p.confirm({
    message: `${skillName} já existe. Substituir?`,
  });
  if (p.isCancel(confirmed)) cancel();
  return confirmed;
}

export async function main(argv) {
  const flags = parseArgs(argv);
  if (flags.help) {
    console.log(helpText().trimEnd());
    return;
  }

  p.intro("Instalar skills");

  const targetId = await chooseTarget(flags);
  const scope = await chooseScope(flags);
  const destination = resolveDestination(targetId, {
    scope,
    cwd: process.cwd(),
    home: os.homedir(),
  });

  const skills = await discoverSkills(path.join(packageRoot, "skills"));
  if (skills.length === 0) {
    p.log.warn("Nenhuma skill encontrada em skills/. Nada para copiar.");
    p.outro("Quando houver um SKILL.md, rode o comando de novo.");
    return;
  }

  const installed = [];
  const replaced = [];
  const skipped = [];

  for (const skill of skills) {
    const dest = path.join(destination, skill.name);
    let overwrite = false;
    if (await pathExists(dest)) {
      overwrite = await confirmOverwrite(skill.name, flags);
      if (!overwrite) {
        skipped.push(skill.name);
        continue;
      }
    }

    const result = await installSkill({
      sourceDir: skill.dir,
      destRoot: destination,
      name: skill.name,
      overwrite,
    });
    if (result.status === "installed") installed.push(skill.name);
    if (result.status === "replaced") replaced.push(skill.name);
  }

  if (installed.length > 0) {
    p.log.success(`Instaladas: ${installed.join(", ")}`);
  }
  if (replaced.length > 0) {
    p.log.success(`Substituídas: ${replaced.join(", ")}`);
  }
  if (skipped.length > 0) {
    p.log.warn(`Mantidas: ${skipped.join(", ")}`);
  }
  p.outro(`Destino: ${destination}`);
}
