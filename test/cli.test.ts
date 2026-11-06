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
    target: "cursor",
    global: true,
    yes: true,
    help: false,
  });
  assert.equal(parseArgs(["--target=agents"]).target, "agents");
  assert.throws(() => parseArgs(["--target", "opencode"]), /ainda não disponível/);
  assert.throws(() => parseArgs(["--nope"]), /desconhecido/);
});

test("sem skills, termina com aviso e não cria o destino", async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "skills-cli-"));
  const result = runCli(["--target", "cursor", "--yes"], cwd);
  const output = `${result.stdout}${result.stderr}`;

  assert.equal(result.status, 0, output);
  assert.match(output, /Nenhuma skill encontrada/);
  await assert.rejects(fs.stat(path.join(cwd, ".cursor")));
});

test("--help sai zero", () => {
  const result = runCli(["--help"], packageRoot);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--target/);
});
