import fs from "node:fs/promises";
import path from "node:path";

const MAX_DEPTH = 3;

export type Skill = {
  name: string;
  dir: string;
};

function errorCode(error: unknown): string | undefined {
  if (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return undefined;
}

async function listDirs(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (errorCode(error) === "ENOENT") return [];
    throw error;
  }

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

async function hasSkillFile(dir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(dir, "SKILL.md"));
    return stat.isFile();
  } catch (error) {
    if (errorCode(error) === "ENOENT") return false;
    throw error;
  }
}

async function walk(dir: string, depth: number, found: Skill[]): Promise<void> {
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

export async function discoverSkills(skillsRoot: string): Promise<Skill[]> {
  const found: Skill[] = [];
  await walk(skillsRoot, 0, found);

  const seen = new Map<string, string>();
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
