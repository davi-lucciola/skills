import assert from "node:assert/strict";
import fs from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
function packageRootFrom(importMetaUrl) {
    let dir = path.dirname(fileURLToPath(importMetaUrl));
    while (true) {
        if (existsSync(path.join(dir, "package.json")))
            return dir;
        const parent = path.dirname(dir);
        if (parent === dir)
            break;
        dir = parent;
    }
    throw new Error("package.json não encontrado");
}
const root = packageRootFrom(import.meta.url);
const launchFiles = [
    "skills/implement-feature/references/hosts.md",
    "skills/implement-feature/SKILL.md",
    "skills/explore-feature/SKILL.md",
    "skills/code-feature/SKILL.md",
    "skills/review-feature/SKILL.md",
    "skills/validate-feature/SKILL.md",
];
const productModels = [
    "composer-2.5",
    "grok-4.7",
    "gpt-5.6-luna",
    "gpt-5.6-terra",
    "haiku",
    "sonnet",
];
function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), "utf8");
}
test("o lançamento herda o pai e cai na allowlist", () => {
    const hosts = read("skills/implement-feature/references/hosts.md");
    assert.match(hosts, /inherit/);
    assert.match(hosts, /allowlist/);
    for (const file of launchFiles) {
        const text = read(file);
        for (const slug of productModels) {
            assert.equal(text.includes(slug), false, `${file} cites ${slug}`);
        }
    }
});
test("a base é develop, main, depois master", () => {
    const text = read("skills/implement-feature/SKILL.md");
    assert.match(text, /develop,\s*then main,\s*then master/);
    assert.match(text, /develop`, `main`, and `master`/);
});
test("sujeira só em .feature-evidence não segura o worktree", () => {
    const text = read("skills/clean-worktrees/SKILL.md");
    assert.match(text, /every dirty path is inside `\.feature-evidence\/` or the status is empty/);
    assert.match(text, /`git -C <original> worktree remove --force <path>` when every dirty path is inside `\.feature-evidence\/`/);
    assert.match(text, /`git -C <original> worktree remove <path>` when the status is empty/);
    assert.match(text, /Any dirty path is outside `\.feature-evidence\/`\. Report that uncommitted path/);
});
