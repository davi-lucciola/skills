import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { discoverSkills } from "../src/discover.js";

async function writeSkill(root, relativeDir) {
  const dir = path.join(root, relativeDir);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "SKILL.md"), `---\nname: ${path.basename(dir)}\n---\n`);
}

test("encontra skills até o terceiro nível e ignora o resto", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "skills-discover-"));
  await fs.writeFile(path.join(root, "README.md"), "não é skill");
  await writeSkill(root, "alpha");
  await writeSkill(root, path.join("engineering", "beta"));
  await writeSkill(root, path.join("engineering", "shadow"));
  await writeSkill(root, path.join("engineering", "shadow", "deeper"));
  await writeSkill(root, path.join("a", "b", "c"));
  await writeSkill(root, path.join("w", "x", "y", "z"));

  const skills = await discoverSkills(root);
  const byName = Object.fromEntries(skills.map((skill) => [skill.name, skill.dir]));

  assert.deepEqual(Object.keys(byName).sort(), ["alpha", "beta", "c", "shadow"]);
  assert.equal(byName.alpha, path.join(root, "alpha"));
  assert.equal(byName.beta, path.join(root, "engineering", "beta"));
  assert.equal(byName.shadow, path.join(root, "engineering", "shadow"));
  assert.equal(byName.c, path.join(root, "a", "b", "c"));
});

test("recusa dois diretórios com o mesmo nome de skill", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "skills-dup-"));
  await writeSkill(root, path.join("one", "demo"));
  await writeSkill(root, path.join("two", "demo"));

  await assert.rejects(discoverSkills(root), /Duas skills com o nome "demo"/);
});

test("diretório sem skills devolve lista vazia", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "skills-empty-"));
  await fs.writeFile(path.join(root, "README.md"), "vazio");
  assert.deepEqual(await discoverSkills(root), []);
  assert.deepEqual(await discoverSkills(path.join(root, "ausente")), []);
});
