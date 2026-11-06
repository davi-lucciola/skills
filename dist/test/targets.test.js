import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { resolveDestination, targets, visibleTargets } from "../src/targets.js";
const cwd = path.resolve("/work/repo");
const home = path.resolve("/home/davi");
test("o menu mostra cursor, agents, claude-code, codex e opencode", () => {
    assert.deepEqual(visibleTargets().map((target) => target.id), ["cursor", "agents", "claude-code", "codex", "opencode"]);
    for (const id of ["devin", "windsurf", "amp", "pi"]) {
        assert.equal(targets[id]?.visible, false);
        assert.ok(targets[id]?.projectDir);
        assert.ok(targets[id]?.globalDir);
    }
});
test("resolve o destino do Cursor e do padrão universal", () => {
    assert.equal(resolveDestination("cursor", { scope: "project", cwd, home }), path.join(cwd, ".cursor/skills"));
    assert.equal(resolveDestination("cursor", { scope: "global", cwd, home }), path.join(home, ".cursor/skills"));
    assert.equal(resolveDestination("agents", { scope: "project", cwd, home }), path.join(cwd, ".agents/skills"));
    assert.equal(resolveDestination("agents", { scope: "global", cwd, home }), path.join(home, ".agents/skills"));
    assert.equal(resolveDestination("claude-code", { scope: "project", cwd, home }), path.join(cwd, ".claude/skills"));
    assert.equal(resolveDestination("claude-code", { scope: "global", cwd, home }), path.join(home, ".claude/skills"));
    assert.equal(resolveDestination("codex", { scope: "project", cwd, home }), path.join(cwd, ".agents/skills"));
    assert.equal(resolveDestination("codex", { scope: "global", cwd, home }), path.join(home, ".agents/skills"));
    assert.equal(resolveDestination("opencode", { scope: "project", cwd, home }), path.join(cwd, ".agents/skills"));
    assert.equal(resolveDestination("opencode", { scope: "global", cwd, home }), path.join(home, ".config/opencode/skills"));
});
test("recusa destino invisível ou desconhecido", () => {
    assert.throws(() => resolveDestination("devin", { scope: "project", cwd, home }), /ainda não disponível/);
    assert.throws(() => resolveDestination("nope", { scope: "project", cwd, home }), /desconhecido/);
});
