import fs from "node:fs/promises";
import path from "node:path";

const MAX_DEPTH = 3;

async function listDirs(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

async function hasSkillFile(dir) {
  try {
    const stat = await fs.stat(path.join(dir, "SKILL.md"));
    return stat.isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function walk(dir, depth, found) {
  if (depth > MAX_DEPTH) return;

  if (depth > 0 && (await hasSkillFile(dir))) {
    found.push({ name: path.basename(dir), dir });
    return;
  }

  if (depth === MAX_DEPTH) return;

  for (const child of await listDirs(dir)) {
    await walk(child, depth + 1, found);
  }
}

export async function discoverSkills(skillsRoot) {
  const found = [];
  await walk(skillsRoot, 0, found);

  const seen = new Map();
  for (const skill of found) {
    const previous = seen.get(skill.name);
    if (previous) {
      throw new Error(
        `Duas skills com o nome "${skill.name}": ${previous} e ${skill.dir}`,
      );
    }
    seen.set(skill.name, skill.dir);
  }

  return found;
}
