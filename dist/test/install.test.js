import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { installSkill } from "../src/install.js";
test("copia a pasta da skill e substitui só quando pedido", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "skills-install-"));
    const source = path.join(root, "source");
    const destRoot = path.join(root, ".cursor", "skills");
    await fs.mkdir(source, { recursive: true });
    await fs.writeFile(path.join(source, "SKILL.md"), "primeira");
    const installed = await installSkill({
        sourceDir: source,
        destRoot,
        name: "demo",
        overwrite: false,
    });
    assert.equal(installed.status, "installed");
    assert.equal(await fs.readFile(path.join(destRoot, "demo", "SKILL.md"), "utf8"), "primeira");
    await fs.writeFile(path.join(source, "SKILL.md"), "segunda");
    const skipped = await installSkill({
        sourceDir: source,
        destRoot,
        name: "demo",
        overwrite: false,
    });
    assert.equal(skipped.status, "skipped");
    assert.equal(await fs.readFile(path.join(destRoot, "demo", "SKILL.md"), "utf8"), "primeira");
    const replaced = await installSkill({
        sourceDir: source,
        destRoot,
        name: "demo",
        overwrite: true,
    });
    assert.equal(replaced.status, "replaced");
    assert.equal(await fs.readFile(path.join(destRoot, "demo", "SKILL.md"), "utf8"), "segunda");
});
