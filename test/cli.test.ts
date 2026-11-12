import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parseArgs } from "../src/cli.js";

function packageRootFrom(importMetaUrl: string): string {
  let dir = path.dirname(fileURLToPath(importMetaUrl));
  while (true) {
    if (existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("package.json não encontrado");
}

const packageRoot = packageRootFrom(import.meta.url);

function runCli(args: string[], cwd: string) {
  return spawnSync(process.execPath, [path.join(packageRoot, "bin/cli.js"), ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("parseArgs lê destino, escopo e confirmação", () => {
  assert.deepEqual(parseArgs(["--target", "cursor", "--yes", "--global"]), {
    command: "install",
    target: "cursor",
    global: true,
    yes: true,
    help: false,
  });
  assert.deepEqual(parseArgs(["update", "--target", "codex", "--global"]), {
    command: "update",
    target: "codex",
    global: true,
    yes: false,
    help: false,
  });
  assert.equal(parseArgs(["--target=agents"]).target, "agents");
  assert.equal(parseArgs(["--target", "claude-code"]).target, "claude-code");
  assert.equal(parseArgs(["--target", "codex"]).target, "codex");
  assert.equal(parseArgs(["--target=opencode"]).target, "opencode");
  assert.equal(parseArgs(["--target", "antigravity"]).target, "antigravity");
  assert.equal(parseArgs(["--target=gemini"]).target, "gemini");
  assert.throws(() => parseArgs(["--target", "devin"]), /ainda não disponível/);
  assert.throws(() => parseArgs(["--nope"]), /desconhecido/);
});

test("em um repositório vazio, copia as skills do pacote", async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "skills-cli-"));
  const result = runCli(["--target", "cursor", "--yes"], cwd);
  const output = `${result.stdout}${result.stderr}`;

  assert.equal(result.status, 0, output);
  assert.match(output, /Instaladas:/);
  assert.match(output, /ask-davi/);
  await fs.stat(path.join(cwd, ".cursor", "skills", "ask-davi", "SKILL.md"));
});

test("--help sai zero", () => {
  const result = runCli(["--help"], packageRoot);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--target/);
  assert.match(result.stdout, /claude-code/);
  assert.match(result.stdout, /codex/);
  assert.match(result.stdout, /opencode/);
  assert.match(result.stdout, /antigravity/);
  assert.match(result.stdout, /gemini/);
  assert.match(result.stdout, /~\/\.gemini\/config\/skills/);
  assert.match(result.stdout, /~\/\.gemini\/skills/);
  assert.match(result.stdout, /update/);
});

test("hosts.md nomeia o lançamento no Antigravity e no Gemini CLI", async () => {
  const hosts = await fs.readFile(
    path.join(packageRoot, "skills/implement-feature/references/hosts.md"),
    "utf8",
  );
  assert.match(hosts, /invoke_subagent/);
  assert.match(hosts, /TypeName: self/);
  assert.match(hosts, /Workspace: inherit/);
  assert.match(hosts, /send_message/);
  assert.match(hosts, /generalist/);
  assert.match(hosts, /temperature/);
  assert.match(hosts, /max_turns/);
});

test("update pergunta antes de substituir e avisa que a skill será trocada", async () => {
  const skillDir = path.join(packageRoot, "skills", "fixture-update");
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "skills-update-"));
  const installedFile = path.join(cwd, ".cursor", "skills", "fixture-update", "SKILL.md");
  await fs.rm(skillDir, { recursive: true, force: true });
  await fs.mkdir(skillDir, { recursive: true });

  try {
    await fs.writeFile(path.join(skillDir, "SKILL.md"), "primeira");
    const installed = runCli(["update", "--target", "cursor"], cwd);
    const installedOutput = `${installed.stdout}${installed.stderr}`;
    assert.equal(installed.status, 0, installedOutput);
    assert.match(installedOutput, /Atualizar skills/);
    assert.match(installedOutput, /Instaladas:/);
    assert.match(installedOutput, /fixture-update/);
    assert.equal(await fs.readFile(installedFile, "utf8"), "primeira");

    await fs.writeFile(path.join(skillDir, "SKILL.md"), "segunda");
    const blocked = runCli(["update", "--target", "cursor"], cwd);
    const blockedOutput = `${blocked.stdout}${blocked.stderr}`;
    assert.notEqual(blocked.status, 0, blockedOutput);
    assert.match(blockedOutput, /fixture-update/);
    assert.match(blockedOutput, /serão substituídas pelas novas/);
    assert.match(blockedOutput, /Use --yes para substituir/);
    assert.equal(await fs.readFile(installedFile, "utf8"), "primeira");

    const updated = runCli(["update", "--target", "cursor", "--yes"], cwd);
    const updatedOutput = `${updated.stdout}${updated.stderr}`;
    assert.equal(updated.status, 0, updatedOutput);
    assert.match(updatedOutput, /já existem e serão substituídas pelas novas/);
    assert.match(updatedOutput, /Substituídas:/);
    assert.match(updatedOutput, /fixture-update/);
    assert.equal(await fs.readFile(installedFile, "utf8"), "segunda");
  } finally {
    await fs.rm(skillDir, { recursive: true, force: true });
  }
});
